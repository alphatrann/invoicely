import { z } from "zod";

export const EditInvoicePageSchema = z.object({
  id: z.string().uuid(),
});
