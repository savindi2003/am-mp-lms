import { z } from "zod";

export const attendanceUpdateFormSchema = z.object({
  present: z.union([z.literal("true"), z.literal("false")], {
    error: "Select a status",
  }),
  weekNo: z.coerce.number().int().positive("Week must be > 0"),
});
