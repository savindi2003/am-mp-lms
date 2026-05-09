"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import PaymentTable from "@/modules/admin/enrollments/payments/components/PaymentTable";
import { useGetPayments } from "@/modules/admin/enrollments/payments/hooks/useGetPayments";
import Spinner from "@/modules/shared/components/Spinner";
import Empty from "@/modules/shared/components/Empty";

export default function AdminPaymentsByEnrollmentPage() {
  const params = useParams<{ enrollmentId: string }>();
  const enrollmentId = useMemo(
    () => Number(params?.enrollmentId ?? NaN),
    [params?.enrollmentId],
  );
  const { payments, getPayments, loading, enrollmentNumber } =
    useGetPayments(enrollmentId);
  console.log(enrollmentNumber);
  if (Number.isNaN(enrollmentId)) {
    return (
      <section className="container mx-auto px-4 py-6">
        <h1 className="text-3xl text-slate-800 font-semibold tracking-tight">
          Payments
        </h1>
        <p className="mt-2 text-sm text-red-600">Invalid enrollment id.</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Payments for Enrollment #{enrollmentNumber}
        </h1>
      </div>

      {loading && <Spinner />}
      {!loading && payments.length === 0 && payments.length === 0 && (
        <Empty resourceName="payment" />
      )}
      {!loading && payments.length !== 0 && (
        <PaymentTable payments={payments} onGetPayments={getPayments} />
      )}
    </section>
  );
}
