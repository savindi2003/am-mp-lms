import type { Course } from "@/modules/shared/types/typeCourse";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getCourses(): Promise<Course[]> {
  const res = await fetch(`${BASE_URL}/api/backend/courses/get-courses`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch courses: ${res.statusText}`);
  }
  return await res.json();
}
