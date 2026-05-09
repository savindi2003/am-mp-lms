import { useEffect, useState } from "react";
import {
  AccessRow,
  getVideoAccessControls as getVideoAccessControlsApi,
} from "../services/apiAccessControl";
import toast from "react-hot-toast";

export function useGetVideoAccessControls(courseId: number, videoId: string) {
  const [rows, setRows] = useState<AccessRow[]>([]);
  const [loading, setLoading] = useState(false);

  async function refetch() {
    try {
      setLoading(true);
      setRows(await getVideoAccessControlsApi(courseId, videoId));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, videoId]);

  return { rows, refetch, loading } as const;
}
