"use client";

import AttendanceRow from "./AttendanceRow";
import Spinner from "@/modules/shared/components/Spinner";

export default function AttendanceTable({
  students,
  setStudents,
  loading
}: any) {
  return (
    <div className="bg-white border mt-4">

      <div className="grid md:grid-cols-5 px-4 py-2 text-sm font-bold bg-gray-100">
        <div>Student</div>
        <div>Student ID</div>
        <div>Enroll ID</div>
        <div>Status</div>
      </div>

      {loading && (
          <Spinner/>
      )}

      <div className="max-h-125 overflow-y-auto">
      {students.map((s: any, i: number) => (
        <AttendanceRow
          key={s.enrollmentId}
          data={s}
          index={i}
          students={students}
          setStudents={setStudents}
        />
      ))}
      </div>
    </div>
  );
}

