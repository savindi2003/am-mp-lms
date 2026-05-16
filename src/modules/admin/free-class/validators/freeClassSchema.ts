import { z } from "zod";

export const freeClassSchema = z.object({
  title: z.string().min(2, "Title is required"),

  description: z.string().optional(),

  meetingLink: z.string().url("Invalid meeting link"),

  lectureDate: z.string().min(1, "Lecture date is required"),

  fromTime: z.string().min(1, "From time is required"),

  toTime: z.string().min(1, "To time is required"),

  classTypeId: z.string().min(1, "Select class type"),

  instructorId: z.string().min(1, "Select instructor"),
});

export type FreeLectureSchemaType = z.infer<
  typeof freeClassSchema
>;