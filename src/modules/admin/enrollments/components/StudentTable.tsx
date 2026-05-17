
"use client";

import { Enrollment } from "@/modules/shared/types/typeEnrollment";
import Table from "@/modules/shared/components/Table";
import StudentRow from "./StudentRow";

function StudentTable({
  enrollments,
  onGetEnrollments,
}: {
  enrollments: Enrollment[];
  onGetEnrollments: () => Promise<void>;
}) {
  return (
    <div className="border border-gray-200 bg-white shadow-sm">
      
      {/* HEADER */}
      <Table>
        <Table.Header
          styles="hidden md:grid md:grid-cols-7
          items-center gap-x-4 bg-gray-50 px-4 py-3 text-xs uppercase text-gray-600"
        >
          <div>Student</div>
          <div>Grade</div>
          <div>Class</div>
          <div>Status</div>
          <div>Active Month</div>
          <div>Enrolled Date</div>
          <div></div>
        </Table.Header>
      </Table>

      {/* SCROLLABLE BODY */}
      <div className="max-h-[600px] overflow-y-auto">
        <Table>
          <Table.Body
            data={enrollments}
            render={(enrollment) => (
              <StudentRow
                key={enrollment.id}
                enrollment={enrollment}
                onGetEnrollments={onGetEnrollments}
              />
            )}
          />
        </Table>
      </div>
    </div>
  );
}

export default StudentTable;