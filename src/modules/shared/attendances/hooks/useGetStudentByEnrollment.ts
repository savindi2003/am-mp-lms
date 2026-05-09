"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAttendanceByEnrollmentId } from "../services/apiAttendance";

type AttendanceData = unknown;

export function useGetStudentByEnrollment(enrollmentId: number) {
  const [data, setData] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadAttendance() {
    if (!Number.isFinite(enrollmentId)) return;

    setLoading(true);

    try {
      const res = await getAttendanceByEnrollmentId(enrollmentId);
      setData(res);
    } catch (e: unknown) {
      const err = e as { message?: string };
      toast.error(err?.message || "Failed to load attendance");
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