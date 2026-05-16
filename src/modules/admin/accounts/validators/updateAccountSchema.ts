import { z } from "zod";

const NIC_REGEX = /^(?:\d{12}|\d{9}[VX])$/;
const CONTACT_NO_REGEX = /^07[0-9]{8}$/;

export const updateAccountSchema = z.object({
  userId: z.number().int().positive(),
  email: z.string().email().optional(),
  NIC: z
    .string()
    .min(1, { message: "* National ID is required" })
    .transform((v) => v.replace(/[\s-]/g, "").toUpperCase())
    .refine((v) => NIC_REGEX.test(v), {
      message: "* Invalid National ID (use 12 digits or 9 digits + V/X)",
    }),
  firstName: z
    .string()
    .min(1, { message: "* First name is required" })
    .optional(),
  lastName: z
    .string()
    .min(1, { message: "* Last name is required" })
    .optional(),
  title: z.string().optional(), // instructor only
  contactNo: z
    .string()
    .regex(CONTACT_NO_REGEX, "Invalid mobile number")
    .optional(),
  guardianContactNo: z
        .string()
        .regex(CONTACT_NO_REGEX, "Invalid mobile number")
        .optional()
        .or(z.literal("")),
  address: z.string().min(5, { message: "* Address is required" }).optional(),
  guardianFirstName: z
    .string()
    .min(1, { message: "* Guardians First name name is required" })
    .optional(),
  guardianLastName: z
    .string()
    .min(1, { message: "* Guardians Last name name is required" })
    .optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  dob: z
    .string()
    .refine((value) => {
      const dob = new Date(value);
      const now = new Date();
      return !isNaN(dob.getTime()) && dob <= now;
    }, "Date of birth cannot be in the future")
    .optional(),
});
