export async function getLectureLinks(classId: number) {
  const res = await fetch(
    `/api/backend/students/classes/${classId}/lecture-links`
  );

  if (!res.ok) throw new Error("Failed to load");

  return res.json();
}