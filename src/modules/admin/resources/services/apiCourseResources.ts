export async function saveCourseResourceKey(
  courseId: number,
  payload: {
    key: string;
    title?: string;
    contentType?: string;
    sizeBytes?: number;
    month?:string;
  },
) {
  const res = await fetch(`/api/backend/admin/courses/${courseId}/resources`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to save resource key");
  return res.json() as Promise<{
    id: string;
    courseId: number;
    s3Key: string;
    title: string;
    contentType?: string | null;
    sizeBytes?: number | null;
    createdAt: string;
    month: string;
  }>;
}

export async function presignCourseResource(
  courseId: number,
  contentType: string,
  fileName?: string,
) {
  const res = await fetch(
    `/api/backend/admin/courses/${courseId}/resources/presign`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType, fileName }),
    },
  );
  if (!res.ok) throw new Error("Failed to get upload URL");
  return res.json() as Promise<{
    uploadUrl: string;
    key: string;
    requiredHeaders?: Record<string, string>;
  }>;
}

export async function listCourseResources(courseId: number) {
  const res = await fetch(`/api/backend/admin/courses/${courseId}/resources`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Failed to load resources");
  return res.json();
}

export async function deleteCourseResource(
  courseId: number,
  resourceId: string,
) {
  const res = await fetch(
    `/api/backend/admin/courses/${courseId}/resources/${resourceId}`,
    { method: "DELETE" },
  );
  if (res.status === 204) return true;
  const text = await res.text().catch(() => "");
  throw new Error(text || "Failed to delete resource");
}
