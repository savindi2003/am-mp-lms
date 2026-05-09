import { useState } from "react";
import toast from "react-hot-toast";
import { updateLinkAccess as updateLinkAccessApi } from "../services/apiAccessControl";

export function useUpdateLinkAccess() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateLinkAccess(
    courseId: number,
    videoId: string,
    enrollmentId: number,
    isAccessed: boolean,
  ) {
    if (!courseId || !videoId || !enrollmentId) {
      setError("Missing identifiers");
      return Promise.reject(new Error("Missing identifiers"));
    }
    setLoading(true);
    const toastId = toast.loading("Saving...");
    try {
      setError(null);
      const res = await updateLinkAccessApi(
        courseId,
        videoId,
        enrollmentId,
        isAccessed,
      );
      toast.success(`Access ${res.isAccessed ? "granted" : "denied"}`, {
        id: toastId,
      });
      return res;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to update access", { id: toastId });
      setError(e?.message ?? "Failed to update access");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, updateLinkAccess } as const;
}
