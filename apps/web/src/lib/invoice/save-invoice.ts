import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/issues";
import { trpcProxyClient } from "@/trpc/client";
import { redirect } from "next/navigation";
import { toast } from "sonner";
export const saveInvoiceToDatabase = async (invoice: ZodCreateInvoiceSchema) => {
  const insertedInvoice = await trpcProxyClient.invoice.insert.mutate(invoice);

  if (!insertedInvoice.success) {
    toast.error(ERROR_MESSAGES.DATABASE_ERROR, {
      description: ERROR_MESSAGES.FAILED_TO_INSERT_DATA,
    });
  } else {
    toast.success(SUCCESS_MESSAGES.INVOICE_SAVED, {
      description: SUCCESS_MESSAGES.INVOICE_SAVED_DESCRIPTION,
    });

    // we will redirect user to its invoice Edit
    redirect(`/edit/${insertedInvoice.invoiceId}`);
  }
};
