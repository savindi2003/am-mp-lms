import { z } from "zod";

export const createLectureLinkSchema = z.object({
  title: z.string().min(1, "Title is required").max(50),
  meetingLink: z.string().url("Enter valid meeting link").or(z.literal("")),
  lectureDate: z.string().min(1, "Date is required"),
  fromTime: z.string().min(1, "From time required"),
  toTime: z.string().min(1, "To time required"),
  month: z.string().min(1, "Access month is required"),
});

export type CreateLectureLinkFormData = z.infer<typeof createLectureLinkSchema>;