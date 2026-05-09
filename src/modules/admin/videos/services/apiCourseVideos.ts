import type { CourseVideoRow } from "../types/typeCourseVideo";

export async function listCourseVideos(
  courseId: number,
): Promise<CourseVideoRow[]> {
  const res = await fetch(`/api/backend/admin/courses/${courseId}/videos`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load resources");
  return res.json();
}

export async function presignVideoUpload(
  courseId: number,
  payload: {
    filename: string;
    contentType: string;
    sizeBytes: number;
    title?: string;
    description?: string;
  },
): Promise<{
  uploadUrl: string;
  key: string;
  requiredHeaders: Record<string, string>;
  videoId: string;
}> {
  const res = await fetch(
    `/api/backend/admin/courses/${courseId}/videos/presign`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  if (!res.ok) throw new Error("Failed to presign upload");
  return res.json();
}

export async function finalizeVideo(
  courseId: number,
  payload: {
    videoId: string;
    title?: string;
    description?: string;
    durationSeconds?: number;
    thumbnailKey?: string;
  },
) {
  const res = await fetch(
    `/api/backend/admin/courses/${courseId}/videos/finalize`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  if (!res.ok) throw new Error("Failed to finalize video");
}
