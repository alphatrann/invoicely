import SignatureInputModal from "@/components/ui/image/signature-input-modal";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/issues";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import React from "react";

const UploadSignatureAsset = ({ disableIcon = false }: { disableIcon?: boolean }) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const uploadImage = useMutation({
    ...trpc.cloudflare.uploadImageFile.mutationOptions(),
    onSuccess: () => {
      toast.success(SUCCESS_MESSAGES.TOAST_DEFAULT_TITLE, {
        description: SUCCESS_MESSAGES.IMAGE_UPLOADED,
      });

      queryClient.invalidateQueries({ queryKey: trpc.cloudflare.listImages.queryKey() });
    },
    onError: (error) => {
      toast.error(ERROR_MESSAGES.TOAST_DEFAULT_TITLE, {
        description: `${ERROR_MESSAGES.UPLOADING_IMAGE}: ${error.message}`,
      });
    },
  });

  const handleBase64Change = async (base64: string | undefined) => {
    if (!base64) return;

    uploadImage.mutate({
      type: "signature",
      base64: base64,
    });
  };

  return (
    <SignatureInputModal
      isLoading={uploadImage.isPending}
      onBase64Change={handleBase64Change}
      maxSizeMB={0.15}
      disableIcon={disableIcon}
    />
  );
};

export default UploadSignatureAsset;
