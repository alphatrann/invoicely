import { db } from "@invoicely/db";

/**
 * List all invoices for a user
 * @param userId - The ID of the user to list invoices for
 * @returns An array of invoices
 */
export const listInvoicesQuery = async () => {
  const invoices = await db.query.invoices.findMany({
    with: {
      invoiceFields: {
        with: {
          clientDetails: {
            with: {
              metadata: true,
            },
          },
          companyDetails: {
            with: {
              metadata: true,
            },
          },
          invoiceDetails: {
            with: {
              billingDetails: true,
            },
          },
          metadata: {
            with: {
              paymentInformation: true,
            },
          },
          items: true,
        },
      },
    },
  });

  return invoices;
};
