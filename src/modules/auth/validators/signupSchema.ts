import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.string().email({ message: "* invalid email address" }),
    firstName: z.string().min(2, { message: "* required" }),
    lastName: z.string().min(2, { message: "* required" }),
    password: z
      .string()
      .min(6, { message: "* password must be at least 6 characters" }),
    confirmPassword: z.string(),
    agreeToTerms: z.literal(true, {
      message: "* you must accept the terms",
    }),
    NIC: z.string().min(10, "* NIC is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "* passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
