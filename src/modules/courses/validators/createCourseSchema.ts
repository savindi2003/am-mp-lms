import { z } from "zod";

const MAX_IMAGE_MB = 2;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;

export const createCourseSchema = z.object({
  name: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  instructorId: z.coerce.number().int().positive("Select an instructor"),
  image: z
    .any()
    .refine(
      (fl: FileList | null) => !!fl && fl.length === 1,
      "Course image is required",
    )
    .refine(
      (fl: FileList) => fl?.[0]?.type?.startsWith("image/"),
      "File must be an image",
    )
    .refine(
      (fl: FileList) => (fl?.[0]?.size ?? 0) <= MAX_IMAGE_BYTES,
      `Image must be ≤ ${MAX_IMAGE_MB}MB`,
    ),
});

export type FormValues = z.infer<typeof createCourseSchema>;
