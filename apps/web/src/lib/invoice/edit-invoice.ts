import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/issues";
import { trpcProxyClient } from "../../trpc/client";
import { toast } from "sonner";

export const editInvoice = async (invoice: ZodCreateInvoiceSchema, id: string) => {
  const insertedInvoice = await trpcProxyClient.invoice.edit.mutate({
    id,
    invoice,
  });

  if (!insertedInvoice.success) {
    toast.error(ERROR_MESSAGES.DATABASE_ERROR, {
      description: ERROR_MESSAGES.FAILED_TO_EDIT_INVOICE,
    });
  } else {
    toast.success(SUCCESS_MESSAGES.INVOICE_EDITED, {
      description: SUCCESS_MESSAGES.INVOICE_EDITED_DESCRIPTION,
    });
  }
};
