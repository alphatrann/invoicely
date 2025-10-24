import { listInvoicesQuery } from "@/lib/db-queries/invoice/listInvoices";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { InternalServerError } from "@/lib/effect/error/trpc";
import { baseProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { Effect } from "effect";

export const listInvoices = baseProcedure.query(async () => {
  // List Invoices Effect
  const listInvoicesEffect = Effect.gen(function* () {
    // Fetch invoices from the database
    const invoices = yield* Effect.tryPromise({
      try: () => listInvoicesQuery(),
      catch: (error) => new InternalServerError({ message: parseCatchError(error) }),
    });

    // Map the invoices to the response format
    return invoices.map((invoice) => ({
      ...invoice,
      invoiceFields: {
        ...invoice.invoiceFields,
        items: invoice.invoiceFields.items.map((item) => ({
          ...item,
          unitPrice: item.unitPrice.toNumber(),
        })),
        invoiceDetails: {
          ...invoice.invoiceFields.invoiceDetails,
          billingDetails: invoice.invoiceFields.invoiceDetails.billingDetails.map((billingDetail) => ({
            ...billingDetail,
            value: billingDetail.value.toNumber(),
          })),
        },
      },
    }));
  });

  // Run the effect
  return Effect.runPromise(
    listInvoicesEffect.pipe(
      Effect.catchTags({
        // If the invoice list retrieval fails, return an internal server error
        InternalServerError: (error) =>
          Effect.fail(new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message })),
      }),
    ),
  );
});
