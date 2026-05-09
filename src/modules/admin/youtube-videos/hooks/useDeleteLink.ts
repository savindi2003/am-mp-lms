import { deleteLink as deleteLinkApi } from "../services/apiYoutubeLinks";
import { useState } from "react";
import toast from "react-hot-toast";

export function useDeleteLink(courseId: number) {
  const [loading, setLoading] = useState(false);

  async function handleDeleteLink(videoId: string) {
    setLoading(true);

    try {
      setLoading(true);
      await deleteLinkApi(courseId, videoId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  return { loading, onDeleteLink: handleDeleteLink };
}
