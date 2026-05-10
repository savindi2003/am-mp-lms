import { useEffect, useState } from "react";
import type { ClassRecodings } from "@prisma/client";
import { getRecordings } from "../services/apiRecordings";

export function useRecordings(courseId: number) {
  const [recordings, setRecordings] = useState<ClassRecodings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getRecordings(courseId);
      setRecordings(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!courseId) return;
    fetchData();
  }, [courseId]);

  return {
    recordings,
    loading,
    error,
    refetch: fetchData,
  };
}