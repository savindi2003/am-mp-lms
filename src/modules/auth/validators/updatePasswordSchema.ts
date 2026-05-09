import { z } from "zod";

export const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "* Current password is required" }),
    newPassword: z
      .string()
      .min(8, { message: "* New password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "* Please confirm your new password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "* Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof updatePasswordSchema>;
export type ResetPasswordPayload = Pick<
  ResetPasswordFormData,
  "currentPassword" | "newPassword"
>;
