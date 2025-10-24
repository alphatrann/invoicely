import { insertInvoiceQuery } from "@/lib/db-queries/invoice/insertInvoice";
import { createInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { InternalServerError } from "@/lib/effect/error/trpc";
import { SUCCESS_MESSAGES } from "@/constants/issues";
import { baseProcedure } from "../../init";
import { TRPCError } from "@trpc/server";
import { Effect } from "effect";

interface MutationResponse {
  success: boolean;
  message: string;
  invoiceId?: string;
}

export const insertInvoice = baseProcedure.input(createInvoiceSchema).mutation<MutationResponse>(async ({ input }) => {
  // Insert Invoice Effect
  const insertInvoiceEffect = Effect.gen(function* () {
    const invoiceId = yield* Effect.tryPromise({
      try: () => insertInvoiceQuery(input),
      catch: (error) => new InternalServerError({ message: parseCatchError(error) }),
    });

    // Return the success message
    return {
      success: true,
      message: SUCCESS_MESSAGES.INVOICE_SAVED,
      invoiceId,
    };
  });

  // Run the effect
  return Effect.runPromise(
    insertInvoiceEffect.pipe(
      Effect.catchTags({
        InternalServerError: (error) =>
          Effect.fail(new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message })),
      }),
    ),
  );
});
