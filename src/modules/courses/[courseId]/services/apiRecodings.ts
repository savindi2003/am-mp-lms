export async function getRecordings(courseId: number) {
  const res = await fetch(
    `/api/backend/courses/${courseId}/recordings`
  );

  
  if (!res.ok) {
    throw new Error("Failed to load recordings");
  }

  return await res.json();
}