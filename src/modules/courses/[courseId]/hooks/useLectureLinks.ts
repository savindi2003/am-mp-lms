

import { useEffect, useState } from "react";
import type { CourseLectureLink, CourseLectureLinkResponse } from "../types/typeLectureLink";
import { getLectureLinks } from "../services/apiLectureLinks";

export function useLectureLinks(courseId: number, initial?: CourseLectureLink[]) {
  const [links, setLinks] = useState<CourseLectureLink[]>(initial ?? []);
  const [accessMap, setAccessMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) return;

    (async () => {
      try {
        setLoading(true);

        const data: CourseLectureLinkResponse = await getLectureLinks(courseId);

        setLinks(data.lectures);
        setAccessMap(data.accessMap || {});
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId, initial]);

  return { links, accessMap, loading, error };
}