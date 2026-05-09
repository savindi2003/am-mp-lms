"use client";

import { useState } from "react";
import { deleteAdminPayment } from "@/modules/admin/enrollments/payments/services/apiPayment";

export function useDeletePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeletePayment = async (
    enrollmentId: number,
    paymentId: number,
  ) => {
    if (!paymentId || !enrollmentId)
      return setError("Enrollment ID or Payment ID not found");
    setLoading(true);
    try {
      setError(null);
      await deleteAdminPayment(enrollmentId, paymentId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e) {
      setError("Failed to delete payment");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    onDeletePayment: handleDeletePayment,
  };
}
