import { useEffect, useState } from "react";
import { CourseLectureLink } from "../../enrollments/types/typeLectureLinks";
import { listLectureLinks } from "../../enrollments/services/apiLectureLinks";

export function useLectureLinks(courseId: number, initial?: CourseLectureLink[]) {
  const [links, setLinks] = useState<CourseLectureLink[]>(initial ?? []);
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState<string | null>(null);

  const getLinks = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `/api/backend/instructor/courses/${courseId}/lecture-links`,
        {
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to load lecture links");
      }

      const data = (await res.json()) as CourseLectureLink[];

      setLinks(data);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
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
    setLinks,
    loading,
    error,
    getLinks,
  };
}