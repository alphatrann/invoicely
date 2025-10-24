import { BadRequestError, InternalServerError, NotFoundError } from "@/lib/effect/error/trpc";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/issues";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { invoiceStatusEnum } from "@invoicely/db/schema/invoice";
import { baseProcedure } from "@/trpc/init";
import { db, schema } from "@invoicely/db";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { Effect } from "effect";
import { z } from "zod";

const updateInvoiceStatusSchema = z.object({
  id: z.string(),
  status: z.enum(invoiceStatusEnum.enumValues),
});

export const updateInvoiceStatus = baseProcedure.input(updateInvoiceStatusSchema).mutation(async ({ input }) => {
  // Update Invoice Status Effect
  const updateInvoiceStatusEffect = Effect.gen(function* () {
    // Get the invoice
    const invoice = yield* Effect.tryPromise({
      try: () =>
        db.query.invoices.findFirst({
          where: (_invoice, { eq }) => eq(_invoice.id, input.id),
        }),
      catch: (error) => new InternalServerError({ message: parseCatchError(error) }),
    });

    // Check if the invoice exists
    if (!invoice) {
      return yield* new NotFoundError({ message: ERROR_MESSAGES.INVOICE_NOT_FOUND });
    }

    // Check if the invoice status is the same as the input status
    if (invoice.status === input.status) {
      return yield* new BadRequestError({ message: ERROR_MESSAGES.TRY_UPDATING_TO_DIFFERENT_STATUS });
    }

    // Update the invoice status
    yield* Effect.tryPromise({
      try: () =>
        db
          .update(schema.invoices)
          .set({ status: input.status, paidAt: input.status === "success" ? new Date() : null })
          .where(eq(schema.invoices.id, input.id)),
      catch: (error) => new InternalServerError({ message: parseCatchError(error) }),
    });

    // Return the success message
    return {
      success: true,
      message: SUCCESS_MESSAGES.INVOICE_STATUS_UPDATED,
    };
  });

  // Run the effect
  return Effect.runPromise(
    updateInvoiceStatusEffect.pipe(
      Effect.catchTags({
        // If the invoice is not found, return a not found error
        NotFoundError: (error) => Effect.fail(new TRPCError({ code: "NOT_FOUND", message: error.message })),
        // If the invoice status is the same as the input status, return a bad request error
        BadRequestError: (error) => Effect.fail(new TRPCError({ code: "BAD_REQUEST", message: error.message })),
        // If the invoice status update fails, return an internal server error
        InternalServerError: (error) =>
          Effect.fail(new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message })),
      }),
    ),
  );
});
