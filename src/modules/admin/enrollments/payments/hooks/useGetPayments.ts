"use client";

import { useCallback, useEffect, useState } from "react";
import { getPaymentsByEnrollment } from "@/modules/admin/enrollments/payments/services/apiPayment";
import { Payment } from "@/modules/admin/enrollments/types/typePayment";
import toast from "react-hot-toast";

export function useGetPayments(enrollmentId: number) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const getPayments = useCallback(async () => {
    setLoading(true);
    try {
      const { enrollment, payments } =
        await getPaymentsByEnrollment(enrollmentId);
      setPayments(payments);
      setEnrollmentNumber(enrollment.enrollmentNumber);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e) {
      toast.error("Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  }, [enrollmentId]);

  useEffect(() => {
    (async () => await getPayments())();
  }, [getPayments]);

  return {
    payments,
    loading,
    getPayments,
    enrollmentNumber,
  };
}
