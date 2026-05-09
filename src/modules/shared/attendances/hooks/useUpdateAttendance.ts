"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { updateAttendance as updateAttendanceApi } from "@/modules/shared/attendances/services/apiAttendance";

export function useUpdateAttendance(enrollmentId: number) {
  const [loading, setLoading] = useState(false);

  async function updateAttendance(
    attendanceId: number,
    present: boolean | "true" | "false",
    weekNo: number,
  ) {
    const presentBool =
      typeof present === "boolean" ? present : present.toLowerCase() === "true";

    if (!Number.isInteger(weekNo) || weekNo <= 0) {
      toast.error("Invalid week");
      return;
    }

    setLoading(true);
    try {
      await updateAttendanceApi(enrollmentId, attendanceId, {
        present: presentBool,
        weekNo,
      });
      toast.success("Attendance updated");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to update Attendance");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { loading, updateAttendance };
}
