import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { env } from "@invoicely/utilities";

export const getUserImagesCount = async (s3: S3Client) => {
  const listObjectsV2Command = new ListObjectsV2Command({
    Bucket: env.MINIO_BUCKET_NAME,
  });

  const response = await s3.send(listObjectsV2Command);

  return response.Contents?.length ?? 0;
};
