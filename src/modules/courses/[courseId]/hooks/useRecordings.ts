"use client";

import { useEffect, useState } from "react";
import { getRecordings } from "../services/apiRecodings";

export function useRecordings(classId: number) {
  const [recordings, setRecordings] = useState<any[]>([]);
  const [accessMap, setAccessMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const data = await getRecordings(classId);

        setRecordings(data.recordings || []);
        setAccessMap(data.accessMap || {});
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [classId]);

  return {
    recordings,
    accessMap,
    loading,
    error,
  };
}