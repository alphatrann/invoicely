import { awsS3Middleware } from "@/trpc/middlewares/awsS3Middleware";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { deleteImage } from "@/lib/cloudflare/r2/deleteImage";
import { MinIOStorageError } from "@/lib/effect/error/trpc";
import { SUCCESS_MESSAGES } from "@/constants/issues";
import { baseProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { Effect } from "effect";
import { z } from "zod";

export const deleteImageFile = baseProcedure
  .use(awsS3Middleware)
  .input(
    z.object({
      key: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    // Delete Image Effect
    const deleteCloudflareImage = Effect.gen(function* () {
      yield* Effect.tryPromise({
        try: () => deleteImage(ctx.s3, input.key),
        catch: (error) => new MinIOStorageError({ message: parseCatchError(error) }),
      });

      // Return the success message
      return {
        success: true,
        message: SUCCESS_MESSAGES.IMAGE_DELETED,
      };
    });

    // Run the effect
    return Effect.runPromise(
      deleteCloudflareImage.pipe(
        Effect.catchTags({
          MinIOStorageError: (error) =>
            Effect.fail(new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message })),
        }),
      ),
    );
  });
