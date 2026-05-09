export async function getInstructorEnrollmentsByCourseId(
  courseId: number,
  page: number,
) {
  const qs = new URLSearchParams({ page: String(page) }).toString();
  const res = await fetch(
    `/api/backend/instructor/${courseId}/get-enrollments-by-course-id-for-attendances?${qs}`,
    {
      method: "GET",
    },
  );
  if (!res.ok) {
    let msg = "Failed to fetch enrollments";
    try {
      msg = (await res.json()).error ?? msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}
