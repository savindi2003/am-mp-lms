import type { CourseLectureLink } from "../types/typeLectureLink";

export async function getLectureLinks(courseId: number) {
 
  const res = await fetch(
    `/api/backend/courses/${courseId}/lecture-links?mode=upcoming`
  );

  if (!res.ok) throw new Error("Failed to load lecture links");

  return (await res.json());
}

