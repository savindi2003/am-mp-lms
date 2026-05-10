import { z } from "zod";

export const MONTH_VALUES = [
  "JAN","FEB","MAR","APR","MAY","JUN",
  "JUL","AUG","SEP","OCT","NOV","DEC",
] as const;

export const createClassSchema = z.object({
  classTypeName: z
    .string()
    .min(1, "Select class type"),   

  description: z
    .string()
    .min(5, "Enter description (min 5 characters)"),

  instructorId: z.coerce
    .number()
    .min(1, "Select instructor"),

  classFee: z.coerce
    .number()
    .min(1, "Enter valid amount"),

  coverImage: z.any().optional(),

 meetingLink: z.string().optional(), 
  linkExpireDate: z.coerce.date().refine((val) => val !== null, {
  message: "Expire date is required",
}),
  googleEventId: z.string().optional()
});

export type CreateClassFormData = z.infer<typeof createClassSchema>;