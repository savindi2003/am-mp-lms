

// "use client";

// import { useParams } from "next/navigation";

// import Spinner from "@/modules/shared/components/Spinner";

// import AttendanceTable from "@/modules/shared/attendances/components/AttendanceTable";

// import { useGetStudentByEnrollment } from "@/modules/shared/attendances/hooks/useGetStudentByEnrollment";

// function Page() {
//   const params =
//     useParams<{ enrollmentId: string }>();

//   const enrollmentId = Number(
//     params.enrollmentId,
//   );

//   const { data, loading } =
//     useGetStudentByEnrollment(
//       enrollmentId,
//     );
    

//   if (loading || !data)
//     return <Spinner />;

//   return (
//     <section className="space-y-6">
//       <div className=" bg-gray-100 p-6 ">
//         <h1 className="text-2xl font-semibold text-slate-800">
//           Attendance Details for #{data.enrollmentNumber}
//         </h1>

//         <div className="mt-6 grid gap-4 md:grid-cols-2">
          
//           <div>
//             <p className="text-sm text-slate-500">
//               Student Name
//             </p>

//             <p className="font-medium">
//               {data.student.firstName}{" "}
//               {data.student.lastName}
//             </p>
//           </div>

//           <div>
//             <p className="text-sm text-slate-500">
//               NIC
//             </p>

//             <p className="font-medium">
//               {data.student.user?.NIC}
//             </p>
//           </div>

//           <div>
//             <p className="text-sm text-slate-500">
//               Email
//             </p>

//             <p className="font-medium">
//               {data.student.user?.email}
//             </p>
//           </div>

//           <div>
//             <p className="text-sm text-slate-500">
//               Grade
//             </p>

//             <p className="font-medium">
//               {
//                 data.class.classType.name
//               }
//             </p>
//           </div>

//           <div>
//             <p className="text-sm text-slate-500">
//               Instructor
//             </p>

//             <p className="font-medium">
//               {
//                 data.class.instructor
//                   .firstName
//               }{" "}
//               {
//                 data.class.instructor
//                   .lastName
//               }
//             </p>
//           </div>

//           <div>
//             <p className="text-sm text-slate-500">
//               Total Attendance
//             </p>

//             <p className="font-medium">
//               {data.Attendance.length}
//             </p>
//           </div>
//         </div>
//       </div>

//       <AttendanceTable
//         attendances={data.Attendance}
//       />
//     </section>
//   );
// }

// export default Page;

"use client";

import { useParams } from "next/navigation";
import Spinner from "@/modules/shared/components/Spinner";
import AttendanceTable from "@/modules/shared/attendances/components/AttendanceTable";
import { useGetStudentByEnrollment } from "@/modules/shared/attendances/hooks/useGetStudentByEnrollment";

type Attendance = any; // replace with real type later

type EnrollmentData = {
  enrollmentNumber: string;
  student: {
    firstName: string;
    lastName: string;
    user?: {
      NIC?: string;
      email?: string;
    };
  };
  class: {
    classType: {
      name: string;
    };
    instructor: {
      firstName: string;
      lastName: string;
    };
  };
  Attendance: Attendance[];
};

function Page() {
  const params = useParams<{ enrollmentId: string }>();
  const enrollmentId = Number(params.enrollmentId);

  const { data, loading } = useGetStudentByEnrollment(enrollmentId);

  const typedData = data as EnrollmentData | undefined;

  if (loading || !typedData) return <Spinner />;

  return (
    <section className="space-y-6">
      <div className="bg-gray-100 p-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Attendance Details for #{typedData.enrollmentNumber}
        </h1>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Student Name</p>
            <p className="font-medium">
              {typedData.student.firstName} {typedData.student.lastName}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">NIC</p>
            <p className="font-medium">
              {typedData.student.user?.NIC}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Email</p>
            <p className="font-medium">
              {typedData.student.user?.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Grade</p>
            <p className="font-medium">
              {typedData.class.classType.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Instructor</p>
            <p className="font-medium">
              {typedData.class.instructor.firstName}{" "}
              {typedData.class.instructor.lastName}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Total Attendance</p>
            <p className="font-medium">
              {typedData.Attendance.length}
            </p>
          </div>
        </div>
      </div>

      <AttendanceTable attendances={typedData.Attendance} />
    </section>
  );
}

export default Page;