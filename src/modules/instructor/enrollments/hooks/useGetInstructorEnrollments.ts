"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { InstructorEnrollment } from "@/modules/instructor/enrollments/types/typeInstructorEnrollment";
import { getInstructorEnrollmentsByCourseId as getInstructorEnrollmentsByCourseIdApi } from "@/modules/instructor/enrollments/services/apiInstructorEnrollment";

export function useGetInstructorEnrollments(courseId: number, page: number) {
  const [enrollments, setEnrollments] = useState<InstructorEnrollment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  async function getInstructorEnrollments() {
    setLoading(true);
    try {
      const { total, enrollments } =
        await getInstructorEnrollmentsByCourseIdApi(courseId, page);
      setEnrollments(enrollments);
      setTotal(total);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to fetch enrollments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await getInstructorEnrollments();
    })();
  }, [courseId]);

  return { total, enrollments, loading, getInstructorEnrollments };
}
