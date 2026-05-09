"use client";
import { useEffect, useState } from "react";
import {
  CourseDay,
  getCourseDays,
} from "@/modules/admin/enrollments/services/apiCourseDays";

export function useCourseDays(courseId?: number) {
  const [days, setDays] = useState<CourseDay[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!courseId) {
      setDays([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getCourseDays(courseId)
      .then((d) => !cancelled && setDays(d))
      .catch(() => !cancelled && setDays([]))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  return { days, loading };
}
