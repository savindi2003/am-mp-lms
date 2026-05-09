"use client";

import { useEffect, useState } from "react";
import { getCourseAttendanceDetailsByEnrollmentId } from "../services/apiAttendance";
import toast from "react-hot-toast";
import { CourseDetailsType } from "@/modules/shared/attendances/types/typeCourseDetails";

export function useGetCourseAttendanceDetails(enrollmentId: number) {
  const [courseDetails, setCourseDetails] = useState<CourseDetailsType>(null);

  const [loading, setLoading] = useState(false);

  async function getCourseAttendanceDetails() {
    setLoading(true);
    try {
      const data = await getCourseAttendanceDetailsByEnrollmentId(enrollmentId);
      setCourseDetails(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load course details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await getCourseAttendanceDetails();
    })();
  }, []);

  return {
    courseDetails,
    loading,
    getCourseAttendanceDetails,
  };
}
