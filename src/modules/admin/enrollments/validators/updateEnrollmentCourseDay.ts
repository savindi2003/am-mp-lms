import { z } from "zod";

export const updateEnrollmentCourseDaySchema = z.object({
  selectedDay: z.string().min(1, "Please select a day"),
});

export type updateEnrollmentCourseDaySchemaFormData = z.infer<
  typeof updateEnrollmentCourseDaySchema
>;
