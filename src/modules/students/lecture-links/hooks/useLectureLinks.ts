// import { useEffect, useState } from "react";
// import { getLectureLinks } from "../services/apiLectureLinks";

// export function useLectureLinks(classId: number) {
//   const [links, setLinks] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         const data = await getLectureLinks(classId);
//         setLinks(data);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [classId]);

//   return { links, loading };
// }

import { useEffect, useState } from "react";

export function useLectureLinks(courseId: number) {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `/api/backend/courses/${courseId}/lecture-links`
        );

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();
        setLinks(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  return { links, loading, error };
}