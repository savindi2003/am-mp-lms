
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useGetEnrollments } from "@/modules/admin/enrollments/hooks/useGetEnrollments";
import CreatePaymentModal from "@/modules/admin/enrollments/components/CreatePaymentModal";
import StudentTable from "@/modules/admin/enrollments/components/StudentTable";
import Spinner from "@/modules/shared/components/Spinner";
import Empty from "@/modules/shared/components/Empty";
import Filters from "@/modules/admin/enrollments/components/Filters";

export default function AdminEnrollmentsPage() {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") || 1);
  const query = searchParams.toString();

  const { total, enrollments, loading, getEnrollments } =
    useGetEnrollments(page, query);

  return (
    <section className="container mx-auto px-4 py-6">
      
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Class Enrollments</h1>
        <CreatePaymentModal getEnrollments={getEnrollments} />
      </div>

      <Filters />

      {loading ? (
        <Spinner />
      ) : enrollments.length === 0 ? (
        <Empty resourceName="enrollments" />
      ) : (
        <StudentTable
          enrollments={enrollments}
          onGetEnrollments={getEnrollments}
        />
      )}
    </section>
  );
}