
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
    <div className="border border-gray-200 bg-white shadow-sm overflow-x-auto">

      {/* HEADER */}
      <div className="min-w-[900px]">
        <Table>
          <Table.Header
            styles=" grid grid-cols-7 items-center gap-x-4 bg-gray-50 px-4 py-3 text-xs uppercase text-black font-semibold min-w-[900px] "
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

    </div>
  );
}

export default StudentTable;


