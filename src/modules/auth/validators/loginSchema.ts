import { z } from "zod";

// Accepts: 123456789V / 123456789X (old) OR 199912345678 (new)
const NID_REGEX = /^(?:\d{12}|\d{9}[VX])$/;

export const loginSchema = z.object({
  NIC: z
    .string()
    .min(1, { message: "* National ID is required" })
    // normalize: remove spaces/dashes, uppercase
    .transform((v) => v.replace(/[\s-]/g, "").toUpperCase())
    .refine((v) => NID_REGEX.test(v), {
      message: "* Invalid National ID (use 12 digits or 9 digits + V/X)",
    }),
  password: z.string().min(1, { message: "* Password is required" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
