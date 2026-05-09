"use client";

import { useEffect, useState } from "react";
import { listCourseResources } from "../services/apiCourseResources";
import { CourseResourceRow } from "@/modules/admin/resources/types/typeCourseResource";
import toast from "react-hot-toast";

export function useGetCourseResources(courseId: number) {
  const [items, setItems] = useState<CourseResourceRow[]>([]);
  const [loading, setLoading] = useState(false);

  async function getCourseResources() {
    try {
      setLoading(true);
      setItems(await listCourseResources(courseId));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load resources");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await getCourseResources(); /* eslint-disable-next-line react-hooks/exhaustive-deps */
    })();
  }, [courseId]);

  return { items, loading, getCourseResources } as const;
}
