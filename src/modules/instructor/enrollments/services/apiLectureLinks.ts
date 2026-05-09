export async function listLectureLinks(courseId: number) {
  const res = await fetch(
     `/api/backend/admin/courses/${courseId}/lecture-links`
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}