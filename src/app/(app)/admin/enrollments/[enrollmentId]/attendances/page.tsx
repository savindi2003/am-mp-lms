// "use client";

// import { useParams } from "next/navigation";

// import { useEffect, useMemo, useState } from "react";
// import AttendanceStatusUpdateForm from "@/modules/shared/attendances/components/AttendanceStatusUpdateForm";
// import AttendanceWeekUpdate from "@/modules/shared/attendances/components/AttendanceWeekUpdate";
// import { useGetStudentByEnrollment } from "@/modules/shared/attendances/hooks/useGetStudentByEnrollment";
// import { useCreateAttendance } from "@/modules/shared/attendances/hooks/useCreateAttendance";
// import { useUpdateCourseWeek } from "@/modules/shared/attendances/hooks/useUpdateCourseWeek";
// import { useGetAttendances } from "@/modules/shared/attendances/hooks/useGetAttendances";
// import { useGetCourseAttendanceDetails } from "@/modules/shared/attendances/hooks/useGetCourseAttendanceDetails";
// import AttendanceTable from "@/modules/shared/attendances/components/AttendanceTable";
// import Spinner from "@/modules/shared/components/Spinner";

// function Page() {
//   const params = useParams<{ enrollmentId: string }>();
//   const enrollmentId = Number(params.enrollmentId);

//   const { student, loading: studentLoading } =
//     useGetStudentByEnrollment(enrollmentId);
//   const {
//     attendances,
//     loading: attendancesLoading,
//     getAttendances,
//   } = useGetAttendances(enrollmentId);
//   const { loading, createAttendance } = useCreateAttendance(enrollmentId);
//   const { courseDetails, getCourseAttendanceDetails } =
//     useGetCourseAttendanceDetails(enrollmentId);
//   const { loading: weekSaving, updateCourseWeek } = useUpdateCourseWeek(
//     enrollmentId,
//     {
//       maxWeek: courseDetails?.totalSessions,
//       onSuccess: getCourseAttendanceDetails,
//     },
//   );
//   // status for Present/Absent dropdown
//   const [status, setStatus] = useState<string>("");

//   // week selector
//   const [weekNo, setWeekNo] = useState<number | "">("");
//   useEffect(() => {
//     if (courseDetails?.currentWeek) setWeekNo(courseDetails.currentWeek);
//   }, [courseDetails]);

//   // options: Week 1..totalSessions
//   const weekOptions = useMemo(() => {
//     const total = courseDetails?.totalSessions ?? 0;
//     return Array.from({ length: total }, (_, i) => i + 1);
//   }, [courseDetails]);

//   if (studentLoading || !student) return <Spinner />;
//   return (
//     <>
//       <h1 className="text-2xl font-semibold text-slate-800">
//         Attendance for #{student.enrollmentNumber}
//       </h1>
//       <p className="text-slate-800 font-medium">{student.student.name}</p>
//       <p>{student.student.NIC}</p>

//           <div>
//             <p className="text-sm text-slate-500">Class Type</p>

//             <p className="font-medium text-slate-800">
//               {student.class.classType.name}
//             </p>
//           </div>

//           <div>
//             <p className="text-sm text-slate-500">Class Description</p>

//             <p className="font-medium text-slate-800">
//               {}
//             </p>
//           </div>

//           <div>
//             <p className="text-sm text-slate-500">Instructor</p>

//             <p className="font-medium text-slate-800">
//               {student.class.instructor.firstName}{" "}
//               {student.class.instructor.lastName}
//             </p>
//           </div>

//       <AttendanceTable
//         enrollmentId={enrollmentId}
//         attendances={attendances}
//         attendancesLoading={attendancesLoading}
//         getAttendances={getAttendances}
//       />

//     </>
//   );
// }

// export default Page; 


"use client";

import { useParams } from "next/navigation";

import Spinner from "@/modules/shared/components/Spinner";

import AttendanceTable from "@/modules/shared/attendances/components/AttendanceTable";

import { useGetAttendanceByEnrollment } from "@/modules/shared/attendances/hooks/useGetStudentByEnrollment";

function Page() {
  const params =
    useParams<{ enrollmentId: string }>();

  const enrollmentId = Number(
    params.enrollmentId,
  );

  const { data, loading } =
    useGetAttendanceByEnrollment(
      enrollmentId,
    );
    

  if (loading || !data)
    return <Spinner />;

  return (
    <section className="space-y-6">
      <div className=" bg-gray-100 p-6 ">
        <h1 className="text-2xl font-semibold text-slate-800">
          Attendance Details for #{data.enrollmentNumber}
        </h1>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          
          <div>
            <p className="text-sm text-slate-500">
              Student Name
            </p>

            <p className="font-medium">
              {data.student.firstName}{" "}
              {data.student.lastName}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              NIC
            </p>

            <p className="font-medium">
              {data.student.user?.NIC}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Email
            </p>

            <p className="font-medium">
              {data.student.user?.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Grade
            </p>

            <p className="font-medium">
              {
                data.class.classType.name
              }
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Instructor
            </p>

            <p className="font-medium">
              {
                data.class.instructor
                  .firstName
              }{" "}
              {
                data.class.instructor
                  .lastName
              }
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Total Attendance
            </p>

            <p className="font-medium">
              {data.Attendance.length}
            </p>
          </div>
        </div>
      </div>

      <AttendanceTable
        attendances={data.Attendance}
      />
    </section>
  );
}

export default Page;