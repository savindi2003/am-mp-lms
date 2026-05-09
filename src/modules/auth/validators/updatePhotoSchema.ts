import { z } from "zod";

export const updatePhotoSchema = z.object({
  photo: z
    .any()
    .refine((file) => file instanceof File, {
      message: "* Please select a file",
    })
    .refine((file) => file?.type?.startsWith("image/"), {
      message: "* Only image files are allowed",
    }),
});

export type UpdatePhotoFormData = z.infer<typeof updatePhotoSchema>;
