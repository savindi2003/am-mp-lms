import { z } from "zod";

export const resetPasswordSchema = z.object({
  userId: z.number().int().positive(),
  newPassword: z.string().min(8),
});
