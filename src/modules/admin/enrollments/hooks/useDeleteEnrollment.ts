"use client";

import { useState } from "react";
import { deleteAdminEnrollment } from "../services/apiEnrollment";

export function useDeleteEnrollment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteEnrollment = async (enrollmentId: number) => {
    if (!enrollmentId) return setError("Enrollment ID not found");
    setLoading(true);
    try {
      setError(null);
      await deleteAdminEnrollment(enrollmentId);
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e?.message ?? "Failed to delete enrollment");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    deleteEnrollment,
  };
}
