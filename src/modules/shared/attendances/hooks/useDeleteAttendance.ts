"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { deleteAttendance as deleteAttendanceApi } from "@/modules/shared/attendances/services/apiAttendance";

export function useDeleteAttendance(enrollmentId: number) {
  const [loading, setLoading] = useState(false);

  async function deleteAttendance(attendanceId: number) {
    setLoading(true);
    try {
      await deleteAttendanceApi(attendanceId, enrollmentId);
      toast.success("Attendance deleted");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to delete Attendance");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { loading, deleteAttendance };
}
