"use client";

import { useEffect, useState } from "react";
import type { CourseVideoRow } from "../types/typeCourseVideo";
import { getAccessibleCourseVideos } from "../services/apiCourseVideos";

export function useGetCourseVideos(
  courseId: number,
  initial?: CourseVideoRow[],
) {
  const [videos, setVideos] = useState<CourseVideoRow[]>(initial ?? []);
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) return; // already have SSR data
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const rows = await getAccessibleCourseVideos(courseId);
        setVideos(rows);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e?.message ?? "Failed to load resources");
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId, initial]);

  return { videos, setVideos, loading, error };
}
