import { InternalServerError, NotFoundError } from "@/lib/effect/error/trpc";
import { insertInvoiceQuery } from "@/lib/db-queries/invoice/insertInvoice";
import { deleteInvoiceQuery } from "@/lib/db-queries/invoice/deleteInvoice";
import { createInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { getInvoiceQuery } from "@/lib/db-queries/invoice/getInvoice";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/issues";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { baseProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { Effect } from "effect";
import { z } from "zod";

const EditInvoiceSchema = z.object({
  id: z.string(),
  invoice: createInvoiceSchema,
});

export const editInvoice = baseProcedure.input(EditInvoiceSchema).mutation(async ({ input }) => {
  const { id, invoice } = input;

  // Edit Invoice Effect
  const editInvoiceEffect = Effect.gen(function* () {
    // Get the old invoice
    const oldInvoice = yield* Effect.tryPromise({
      try: () => getInvoiceQuery(id),
      catch: (error) => new InternalServerError({ message: parseCatchError(error) }),
    });

    // Check if the invoice exists
    if (!oldInvoice) {
      return yield* new NotFoundError({ message: ERROR_MESSAGES.INVOICE_NOT_FOUND });
    }

    // Delete the old invoice
    yield* Effect.tryPromise({
      try: () => deleteInvoiceQuery(id),
      catch: (error) => new InternalServerError({ message: parseCatchError(error) }),
    });

    // Insert the new invoice
    yield* Effect.tryPromise({
      try: () => insertInvoiceQuery(invoice, oldInvoice.id),
      catch: (error) => new InternalServerError({ message: parseCatchError(error) }),
    });

    // Return the success message
    return {
      success: true,
      message: SUCCESS_MESSAGES.INVOICE_EDITED,
    };
  });

  // Run the effect
  return Effect.runPromise(
    editInvoiceEffect.pipe(
      Effect.catchTags({
        NotFoundError: (error) => Effect.fail(new TRPCError({ code: "NOT_FOUND", message: error.message })),
        InternalServerError: (error) =>
          Effect.fail(new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message })),
      }),
    ),
  );
});
