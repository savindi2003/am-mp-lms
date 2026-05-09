"use client";

import { useEffect, useState } from "react";

type AccessRecord = {
  month: string;
  status: "PAID" | "PENDING" | "OVERRIDDEN";
};

export function useResourceAccess(courseId: number) {
  const [accessMap, setAccessMap] = useState<Record<string, AccessRecord>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/backend/student/courses/${courseId}/access`
        );

        const data: AccessRecord[] = await res.json();

        const map: Record<string, AccessRecord> = {};
        data.forEach((r) => {
          map[r.month] = r;
        });

        setAccessMap(map);
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  return { accessMap, loading };
}