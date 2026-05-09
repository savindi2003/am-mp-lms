import { YoutubeLinkRow } from "@/modules/admin/youtube-videos/types/typeYoutubeLink";

export async function listYoutubeLinks(
  courseId: number,
): Promise<YoutubeLinkRow[]> {
  const r = await fetch(
    `/api/backend/admin/courses/${courseId}/youtube-videos`,
    {
      cache: "no-store",
    },
  );
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function createYoutubeLink(
  courseId: number,
  payload: {
    title: string;
    description?: string;
    link: string;
    month: string;
  },
) {
  const r = await fetch(
    `/api/backend/admin/courses/${courseId}/youtube-videos`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  if (!r.ok) throw new Error(await r.text());
}

export async function setYoutubeLinkVisibility(
  courseId: number,
  videoId: string,
  visibility: "PUBLISHED" | "HIDDEN",
): Promise<{ id: string; visibility: "PUBLISHED" | "HIDDEN" }> {
  const res = await fetch(
    `/api/backend/admin/courses/${courseId}/youtube-videos/${videoId}/visibility`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility }),
    },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to update visibility");
  }
  return res.json();
}

export async function deleteLink(
  courseId: number,
  videoId: string,
): Promise<void> {
  const res = await fetch(
    `/api/backend/admin/courses/${courseId}/youtube-videos/${videoId}`,
    {
      method: "DELETE",
    },
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to delete link");
  }
}
