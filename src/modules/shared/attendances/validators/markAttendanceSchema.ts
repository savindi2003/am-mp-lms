import { z } from "zod";

export const markAttendanceSchema = z.object({
  courseId: z.number().int().positive(),
  weekNo: z.number().int().min(1),
  marks: z
    .array(
      z.object({
        enrollmentId: z.number().int().positive(),
        present: z.boolean(),
        note: z.string().max(200).optional(),
      }),
    )
    .min(1),
});

export type MarkAttendanceInput = z.infer<typeof markAttendanceSchema>;
