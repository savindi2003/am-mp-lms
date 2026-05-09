"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { createAttendance as createAttendanceApi } from "@/modules/shared/attendances/services/apiAttendance";

export function useCreateAttendance(enrollmentId: number) {
  const [loading, setLoading] = useState(false);

  async function createAttendance(present: "true" | "false") {
    const presentBool = present === "true";

    setLoading(true);
    try {
      await createAttendanceApi(enrollmentId, {
        present: presentBool,
      });
      toast.success("Attendance saved");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to create Attendance");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { loading, createAttendance };
}
