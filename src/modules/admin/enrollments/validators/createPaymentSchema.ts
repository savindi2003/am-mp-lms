import { z } from "zod";

export const createPaymentSchema = z.object({
  NIC: z.string().min(1, "* NIC required"),

  classTypeId: z.coerce
    .number()
    .int()
    .positive({ message: "* Class type required" }),

  classIds: z
    .array(z.coerce.number())
    .min(1, "* Select at least one class"),

  month: z.string().min(1, "* Month required"),

  amount: z.coerce.number().min(1, "* Amount required"),
});

export type CreatePaymentFormData = z.infer<typeof createPaymentSchema>;