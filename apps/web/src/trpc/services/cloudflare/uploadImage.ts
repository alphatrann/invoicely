import {
  ForbiddenError,
  PayloadTooLargeError,
  MinIOStorageError,
  ServiceUnavailableError,
} from "@/lib/effect/error/trpc";
import { getFileSizeFromBase64 } from "@/lib/invoice/get-file-size-from-base64";
import { getUserImagesCount } from "@/lib/cloudflare/r2/getUserImagesCount";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/issues";
import { awsS3Middleware } from "@/trpc/middlewares/awsS3Middleware";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { uploadImage } from "@/lib/cloudflare/r2/uploadImage";
import { baseProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { Effect } from "effect";
import { z } from "zod";

const fileSizes = {
  logo: 400000, // 400kb
  signature: 150000, // 150kb
};

export const uploadImageFile = baseProcedure
  .use(awsS3Middleware)
  .input(
    z.object({
      type: z.enum(["logo", "signature"]),
      base64: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    // Upload Image Effect
    const uploadImageEffect = Effect.gen(function* () {
      const userImagesCount = yield* Effect.tryPromise({
        try: () => getUserImagesCount(ctx.s3),
        catch: (error) => new MinIOStorageError({ message: parseCatchError(error) }),
      });

      // Check if the user has reached the maximum number of images
      if (userImagesCount >= 25) {
        return yield* new ForbiddenError({ message: ERROR_MESSAGES.MAX_IMAGES_REACHED });
      }

      // Get the size of the image
      const size = getFileSizeFromBase64(input.base64);

      // Check if the image is too large
      const typeSize = fileSizes[input.type];

      // Check if the image is too large
      if (size > typeSize) {
        return yield* new PayloadTooLargeError({
          message: `Image is too large. ${input.type} can only be below ${Math.round(typeSize / 1000)} KB`,
        });
      }

      // Upload the image to Cloudflare MinIO
      const image = yield* Effect.tryPromise({
        try: () => uploadImage(ctx.s3, input.base64, input.type),
        catch: (error) => new MinIOStorageError({ message: parseCatchError(error) }),
      });

      // Check if the image was uploaded successfully
      if (!image) {
        return yield* new ServiceUnavailableError({ message: ERROR_MESSAGES.UPLOADING_IMAGE });
      }

      // Return the success message
      return {
        success: true,
        message: SUCCESS_MESSAGES.IMAGE_UPLOADED,
        image: image,
      };
    });

    // Run the effect
    return Effect.runPromise(
      uploadImageEffect.pipe(
        Effect.catchTags({
          PayloadTooLargeError: (error) =>
            Effect.fail(new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: error.message })),
          // If the image was not uploaded successfully, return a service unavailable error
          ServiceUnavailableError: (error) =>
            Effect.fail(new TRPCError({ code: "SERVICE_UNAVAILABLE", message: error.message })),
          // If the image was not uploaded successfully, return a service unavailable error
          MinIOStorageError: (error) =>
            Effect.fail(new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message })),
        }),
      ),
    );
  });
