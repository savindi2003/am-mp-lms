import { z } from "zod";

export const uploadResourceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "* Title is required" })
    .max(30, { message: "* Max 30 characters" }),
  // Avoid FileList references on the server; just check "length" generically
  file: z
    .any()
    .refine(
      (v) => v && typeof v === "object" && "length" in v && v.length === 1,
      "* Select one file",
    ),

  month: z.string().min(1, "Access month is required"),
});

export type uploadResourceFormData = z.infer<typeof uploadResourceSchema>;
