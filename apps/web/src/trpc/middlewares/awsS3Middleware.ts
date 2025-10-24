import { S3Client } from "@aws-sdk/client-s3";
import { env } from "@invoicely/utilities";
import { middleware } from "@/trpc/init";

export const awsS3Middleware = middleware(async function awsS3Middleware(options) {
  const s3 = new S3Client({
    region: "auto",
    endpoint: env.MINIO_ENDPOINT || "",
    credentials: {
      accessKeyId: env.MINIO_ACCESS_KEY_ID || "",
      secretAccessKey: env.MINIO_SECRET_ACCESS_KEY || "",
    },
    forcePathStyle: true,
  });

  return options.next({
    ctx: {
      s3: s3,
    },
  });
});
