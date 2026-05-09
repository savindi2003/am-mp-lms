"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getAttendanceByEnrollmentId } from "../services/apiAttendance";

export function useGetAttendanceByEnrollment(
  enrollmentId: number,
) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function loadAttendance() {
    if (!Number.isFinite(enrollmentId)) return;

    setLoading(true);

    try {
      const res =
        await getAttendanceByEnrollmentId(
          enrollmentId,
        );

      setData(res);
    } catch (e: any) {
      toast.error(
        e?.message || "Failed to load attendance",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAttendance();
  }, [enrollmentId]);

  return {
    data,
    loading,
    loadAttendance,
  };
}
