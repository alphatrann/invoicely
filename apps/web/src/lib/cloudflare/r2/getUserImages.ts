import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { env } from "@invoicely/utilities";

export const getUserImages = async (s3: S3Client) => {
  const response = await s3.send(
    new ListObjectsV2Command({
      Bucket: env.MINIO_BUCKET_NAME,
    }),
  );

  // sort images by createdAt
  const sortedImages = (response.Contents ?? []).sort((a, b) => {
    return new Date(b.LastModified ?? 0).getTime() - new Date(a.LastModified ?? 0).getTime();
  });

  return sortedImages;
};
