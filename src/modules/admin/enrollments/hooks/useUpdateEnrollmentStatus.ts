"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { EnrollmentStatus } from "@prisma/client";
import { updateEnrollmentStatus as updateEnrollmentStatusApi } from "@/modules/admin/enrollments/services/apiEnrollment";

export function useUpdateEnrollmentStatus() {
  const [loading, setLoading] = useState(false);

  async function updateEnrollmentStatus(id: number, status: EnrollmentStatus) {
    if (!id) throw new Error("Enrollment id is required");
    if (!status) throw new Error("Enrollment status is required");

    setLoading(true);
    const toastId = toast.loading("Updating status...");
    try {
      await updateEnrollmentStatusApi(id, status);
      toast.success("Enrollment status updated", { id: toastId });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to update status", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    updateEnrollmentStatus,
  };
}
