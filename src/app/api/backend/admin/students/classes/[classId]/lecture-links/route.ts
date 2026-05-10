// import { useEffect, useState } from "react";
// import type { CourseLectureLink } from "../types/typeLectureLink";
// import { getLectureLinks } from "../services/apiLectureLinks";

// export function useLectureLinks(courseId: number, initial?: CourseLectureLink[]) {
//   const [links, setLinks] = useState<CourseLectureLink[]>(initial ?? []);
//   const [loading, setLoading] = useState(!initial);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (initial) return;

//     (async () => {
//       try {
//         setLoading(true);
//         const data = await getLectureLinks(courseId);
//         setLinks(data);
//       } catch (e: any) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [courseId, initial]);

//   return { links, loading, error };
// }

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Payments route working" });
}