"use client";
import { useParams } from "next/navigation";

import { useEffect, useMemo, useState } from "react";
import AttendanceStatusUpdateForm from "@/modules/shared/attendances/components/AttendanceStatusUpdateForm";
import AttendanceWeekUpdate from "@/modules/shared/attendances/components/AttendanceWeekUpdate";
import Spinner from "@/modules/shared/components/Spinner";
import { useGetStudentByEnrollment } from "@/modules/shared/attendances/hooks/useGetStudentByEnrollment";
import { useCreateAttendance } from "@/modules/shared/attendances/hooks/useCreateAttendance";
import { useUpdateCourseWeek } from "@/modules/shared/attendances/hooks/useUpdateCourseWeek";
import { useGetAttendances } from "@/modules/shared/attendances/hooks/useGetAttendances";
import { useGetCourseAttendanceDetails } from "@/modules/shared/attendances/hooks/useGetCourseAttendanceDetails";
import AttendanceTable from "@/modules/shared/attendances/components/AttendanceTable";

function Page() {
  const params = useParams<{ id: string }>();
  const enrollmentId = Number(params.id);

  const { student } = useGetStudentByEnrollment(enrollmentId);
  const {
    attendances,
    loading: attendancesLoading,
    getAttendances,
  } = useGetAttendances(enrollmentId);
  const { loading, createAttendance } = useCreateAttendance(enrollmentId);
  const { courseDetails, getCourseAttendanceDetails } =
    useGetCourseAttendanceDetails(enrollmentId);
  const { loading: weekSaving, updateCourseWeek } = useUpdateCourseWeek(
    enrollmentId,
    {
      maxWeek: courseDetails?.totalSessions,
      onSuccess: getCourseAttendanceDetails,
    },
  );
  // status for Present/Absent dropdown
  const [status, setStatus] = useState<string>("");

  // week selector
  const [weekNo, setWeekNo] = useState<number | "">("");
  useEffect(() => {
    if (courseDetails?.currentWeek) setWeekNo(courseDetails.currentWeek);
  }, [courseDetails]);

  // options: Week 1..totalSessions
  const weekOptions = useMemo(() => {
    const total = courseDetails?.totalSessions ?? 0;
    return Array.from({ length: total }, (_, i) => i + 1);
  }, [courseDetails]);
  console.log(student?.courseType);

  if (!student) return <Spinner />;
  return (
    <>
      <h1 className="text-2xl font-semibold text-slate-800">
        Attendance for #{student.enrollmentNumber}
      </h1>
      <p>{student.name}</p>
      <p>{student.NIC}</p>
      <div className="flex items-center gap-4">
        <AttendanceWeekUpdate
          courseType={student.courseType}
          weekNo={weekNo}
          updateCourseWeek={updateCourseWeek}
          courseDetails={courseDetails}
          onWeekNo={setWeekNo}
          weekSaving={weekSaving}
          weekOptions={weekOptions}
        />

        {/* Status selector */}
        <AttendanceStatusUpdateForm
          onStatus={setStatus}
          getAttendances={getAttendances}
          status={status}
          createAttendance={createAttendance}
          loading={loading}
          weekSaving={weekSaving}
        />
      </div>

      <AttendanceTable
        enrollmentId={enrollmentId}
        attendances={attendances}
        attendancesLoading={attendancesLoading}
        getAttendances={getAttendances}
      />
    </>
  );
}

export default Page;
