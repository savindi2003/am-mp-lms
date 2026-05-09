import type { CourseVideoRow } from "@/modules/courses/[courseId]/types/typeCourseVideo";

export async function getAccessibleCourseVideos(courseId: number) {
  const res = await fetch(`/api/backend/courses/${courseId}/videos`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load course resources");
  return (await res.json()) as CourseVideoRow[];
}
