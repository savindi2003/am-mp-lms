import { z } from "zod";

export const createYoutubeLinkSchema = z.object({
  title: z.string().min(1, "Title is required").max(30),
  description: z.string().max(100).optional().or(z.literal("")),
  link: z.string().url("Enter a valid URL"),
  month: z.string().min(1, "Access month is required")
});
export type CreateYoutubeLinkFormData = z.infer<typeof createYoutubeLinkSchema>;
