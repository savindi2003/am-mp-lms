export type AccessRow = {
  id: number;
  plan: "FULL" | "INSTALLMENTS";
  nextDueAt: string | null; // ISO or null
  student: { firstName: string; lastName: string; enrollmentNo: string };
  courseFee: number;
  totalPaid: number;
  isAccessed: boolean;
};

export async function getVideoAccessControls(
  courseId: number,
  videoId: string,
): Promise<AccessRow[]> {
  const res = await fetch(
    `/api/backend/admin/courses/${courseId}/youtube-videos/${videoId}/access-control`,
    { method: "GET" },
  );
  if (!res.ok) throw new Error("Failed to fetch access list");
  return res.json();
}

export async function updateLinkAccess(
  courseId: number,
  videoId: string,
  enrollmentId: number,
  isAccessed: boolean,
): Promise<{ enrollmentId: number; videoId: string; isAccessed: boolean }> {
  const res = await fetch(
    `/api/backend/admin/courses/${courseId}/youtube-videos/${videoId}/access-control`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAccessed, enrollmentId }),
    },
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to update access for link");
  }
  return res.json();
}
