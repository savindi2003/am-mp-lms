import type { CourseLectureLink } from "../types/typeLectureLink";

export async function getLectureLinks(courseId: number) {
  const res = await fetch(
    `/api/backend/instructor/courses/${courseId}/lecture-links`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to load lecture links");
  }

  return (await res.json()) as CourseLectureLink[];
}