"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAttendanceByEnrollmentId } from "../services/apiAttendance";

type AttendanceRecord = {
  id: number;
  status: string;
  createdAt?: string;
};

type StudentEnrollmentData = {
  id: number;
  enrollmentNumber: string;

  student: {
    firstName: string;
    lastName: string;

    user?: {
      NIC?: string;
      email?: string;
    };
  };

  class: {
    classType: {
      name: string;
    };

    instructor: {
      firstName: string;
      lastName: string;
    };
  };

  Attendance: AttendanceRecord[];
};

export function useGetStudentByEnrollment(
  enrollmentId: number
) {
  const [data, setData] =
    useState<StudentEnrollmentData | null>(null);

  const [loading, setLoading] =
    useState(false);

  async function loadAttendance() {
    if (!Number.isFinite(enrollmentId)) return;

    setLoading(true);

    try {
      const res =
        await getAttendanceByEnrollmentId(
          enrollmentId
        );

      setData(res);
    } catch (e: unknown) {
      const err = e as {
        message?: string;
      };

      toast.error(
        err?.message ||
          "Failed to load attendance"
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