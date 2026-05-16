import { z } from "zod";

export const ROLES = ["STUDENT", "INSTRUCTOR", "ADMIN"] as const;
export type RoleLiteral = (typeof ROLES)[number];

const NIC_REGEX = /^(?:\d{12}|\d{9}[VX])$/;
const CONTACT_NO_REGEX = /^07[0-9]{8}$/;

export const createAccountSchema = z
  .object({
    role: z.enum(ROLES),
    NIC: z
      .string()
      .min(1, { message: "* National ID is required" })
      .transform((v) => v.replace(/[\s-]/g, "").toUpperCase())
      .refine((v) => NIC_REGEX.test(v), {
        message: "* Invalid National ID (use 12 digits or 9 digits + V/X)",
      }),
    email: z.string().email({ message: "* Enter a valid email" }),
    password: z
      .string()
      .min(8, { message: "* Password must be at least 8 characters" }),
    title: z.string().optional(),
    firstName: z.string().min(1, { message: "* First name is required" }),
    lastName: z.string().min(1, { message: "* Last name is required" }),
    //
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
      .min(1, { message: "* Guardian first name is required" })
      .optional(),
    guardianLastName: z
      .string()
      .min(1, { message: "* Guardian last name is required" })
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
  })
  .superRefine((val, ctx) => {
    if (val.role === "INSTRUCTOR" && !val.title?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["title"],
        message: "* Title is required for instructors",
      });
    }
  });

export type CreateAccountFormData = z.infer<typeof createAccountSchema>;
export type CreateAccountPayload = CreateAccountFormData;
