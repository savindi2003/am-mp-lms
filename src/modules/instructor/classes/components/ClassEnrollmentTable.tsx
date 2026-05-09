// src/modules/instructor/classes/components/ClassEnrollmentTable.tsx

"use client";

import Table from "@/modules/shared/components/Table";
import Spinner from "@/modules/shared/components/Spinner";
import Empty from "@/modules/shared/components/Empty";
import Pagination from "@/modules/shared/components/Pagination";
import { useSearchParams } from "next/navigation";
import { useGetClassEnrollments } from "../hooks/useGetClassEnrollments";
import ClassEnrollmentRow from "./ClassEnrollmentRow";

export default function ClassEnrollmentTable({ classId }: { classId: number }) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);

  const { enrollments, total, loading, refetch } =
    useGetClassEnrollments(classId, page);

  if (loading) return <Spinner />;
  if (!loading && enrollments.length === 0)
    return <Empty resourceName="enrollments" />;

  return (
    <>
      <div className="border">
        <Table>
          <Table.Header styles="grid grid-cols-6 p-3 bg-slate-100 text-sm font-semibold">
            <div>Name</div>
            <div>NIC</div>
            <div>Enrollment No</div>
            <div>Date</div>
            <div>Active Month</div>
            <div>Status</div>
          </Table.Header>

          <Table.Body
            data={enrollments}
            render={(enrollment) => (
              <ClassEnrollmentRow key={enrollment.id} enrollment={enrollment} />
            )}
          />
        </Table>
      </div>

      <Pagination count={total} refetch={refetch} />
    </>
  );
}