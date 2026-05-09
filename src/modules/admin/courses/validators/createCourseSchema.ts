import { z } from "zod";

export const DAY_VALUES = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const createCourseSchema = z.object({
  // CourseType table (new row)
  courseTypeName: z
    .string()
    .trim()
    .min(2, "Type name must be at least 2 characters")
    .max(80, "Max 80 characters"),

  // Course fields
  description: z.string().min(10, "Description must be at least 10 characters"),
  instructorId: z.coerce.number().int().positive("Please select an instructor"),
  courseFee: z.coerce.number().int().positive("Enter a positive fee"),
  totalSessions: z.coerce.number().int().positive("Enter a positive value"),

  // CourseDay[]
  days: z.array(z.enum(DAY_VALUES)).min(1, "Select at least one day"),

  // Cover image (S3)
  coverImage: z
    .custom<File>((v) => v instanceof File, {
      message: "Please select an image",
    })
    .refine((f) => f.size <= MAX_IMAGE_SIZE, "Max file size is 5MB")
    .refine(
      (f) => ACCEPTED_IMAGE_TYPES.includes(f.type),
      "Only JPEG, PNG, or WEBP",
    ),
});

export type CreateCourseFormData = z.infer<typeof createCourseSchema>;
