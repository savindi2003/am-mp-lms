// src/modules/instructor/classes/services/apiClassEnrollment.ts

export async function getClassEnrollments(classId: number, page: number) {
  const qs = new URLSearchParams({ page: String(page) }).toString();

  const res = await fetch(
    `/api/backend/instructor/class/${classId}/enrollments?${qs}`
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API Error");
  }

  return res.json();
}