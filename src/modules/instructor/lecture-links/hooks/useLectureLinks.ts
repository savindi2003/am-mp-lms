import { useEffect, useState } from "react";
import type { CourseLectureLink } from "../types/typeLectureLink";
import { getLectureLinks } from "../services/apiLectureLinks";

export function useLectureLinks(courseId: number) {
  const [links, setLinks] = useState<CourseLectureLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getLinks = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getLectureLinks(courseId);
      setLinks(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!courseId) return;
    getLinks();
  }, [courseId]);

  return {
    links,
    loading,
    error,
    getLinks,
  };
}