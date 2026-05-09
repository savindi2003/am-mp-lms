"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type CourseDetail,
  getCourse as getCourseApi,
} from "@/modules/admin/courses/services/apiCourse";

export function useGetCourse(courseId?: number) {
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getCourseApi(courseId);
      setCourse(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e?.message ?? "Failed to load course");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  return { loading, course, error, refetch: fetchCourse };
}
