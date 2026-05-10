import type { ClassRecodings } from "@prisma/client";

export async function getRecordings(courseId: number) {
  const res = await fetch(
    `/api/backend/instructor/courses/${courseId}/recordings`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to load recordings");
  }

  return (await res.json()) as ClassRecodings[];
}