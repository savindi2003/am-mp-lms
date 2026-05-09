"use client";

import { useEffect, useState } from "react";
import { getAdminAttendances } from "../services/apiAttendance";
import toast from "react-hot-toast";
import { AttendanceType } from "@/modules/shared/attendances/types/typeAttendance";

export function useGetAttendances(enrollmentId: number) {
  const [attendances, setAttendances] = useState<AttendanceType[]>([]);

  const [loading, setLoading] = useState(false);

  async function getAttendances() {
    setLoading(true);
    try {
      const data = await getAdminAttendances(enrollmentId);
      setAttendances(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load payments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await getAttendances();
    })();
  }, []);

  return {
    attendances,
    loading,
    getAttendances,
  };
}
