"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { updateEnrollmentCourseDay as updateEnrollmentCourseDayApi } from "@/modules/admin/enrollments/services/apiEnrollment";

export function useUpdateEnrollmentCourseDay() {
  const [loading, setLoading] = useState(false);

  async function updateEnrollmentCourseDay(
    enrollmentId: number,
    courseDayId: number,
  ) {
    if (!enrollmentId) throw new Error("Enrollment id is required");
    if (!courseDayId) throw new Error("Course day id is required");

    setLoading(true);
    const toastId = toast.loading("Updating course day...");
    try {
      await updateEnrollmentCourseDayApi(enrollmentId, courseDayId);
      toast.success("Course day updated", { id: toastId });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to update course day", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return { loading, updateEnrollmentCourseDay };
}
