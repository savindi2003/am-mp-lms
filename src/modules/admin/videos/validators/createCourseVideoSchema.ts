import { z } from "zod";

const isFileList = (val: unknown): val is FileList =>
  typeof window !== "undefined" &&
  typeof FileList !== "undefined" &&
  val instanceof FileList;

export const createCourseVideoSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(150, "Keep it under 150 characters"),
  description: z
    .string()
    .max(1000, "Max 1000 characters")
    .optional()
    .or(z.literal("")), // allow empty string from textarea
  file: z
    .custom<FileList>(isFileList, "Select one video file")
    .refine((files) => files.length === 1, "Select one video file")
    .refine(
      (files) => files.item(0)?.type?.startsWith("video/") ?? false,
      "File must be a video",
    ),
});

export type CreateCourseVideoFormData = z.infer<typeof createCourseVideoSchema>;
