import type { Weekday } from "@prisma/client";

export type CourseDay = { id: number; day: Weekday };

export async function getCourseDays(courseId: number): Promise<CourseDay[]> {
  const res = await fetch(`/api/backend/admin/courses/${courseId}/days`, {});
  if (!res.ok) throw new Error("Failed to load course days");
  return res.json();
}
