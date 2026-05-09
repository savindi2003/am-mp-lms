
import { z } from "zod";

export const paymentSchema = z.object({
  studentId: z.number().optional(),

  month: z.string().min(1, "Month is required"),

  classTypeId: z.number().optional(),

  classIds: z.array(z.number()).optional(),

  packageId: z.number().optional(),

  amount: z.number().min(1, "Amount must be greater than 0"),
});