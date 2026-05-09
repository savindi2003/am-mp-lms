// "use client";

// import Table from "@/modules/shared/components/Table";
// import { useGetInstructorEnrollments } from "@/modules/instructor/enrollments/hooks/useGetInstructorEnrollments";
// import InstructorEnrollmentRow from "@/modules/instructor/enrollments/components/InstructorEnrollmentRow";
// import Spinner from "@/modules/shared/components/Spinner";
// import Empty from "@/modules/shared/components/Empty";
// import { useSearchParams } from "next/navigation";
// import Pagination from "@/modules/shared/components/Pagination";

// function InstructorEnrollmentTable({ courseId }: { courseId: number }) {
//   const searchParams = useSearchParams();
//   const page = Number(searchParams.get("page") || 1);
//   const { total, enrollments, loading, getInstructorEnrollments } =
//     useGetInstructorEnrollments(courseId, page);

//   if (loading) return <Spinner />;
//   if (!loading && enrollments.length === 0)
//     return <Empty resourceName="enrollments" />;
//   return (
//     <>
//       <div className="border">
//         <Table>
//           <Table.Header styles="hidden md:grid md:grid-cols-[1.2fr_1fr_1fr_1fr_0.2fr] items-center gap-x-4 bg-slate-50 px-4 py-3 text-xs font-medium uppercase text-slate-600 sm:text-sm md:text-base">
//             <div role="columnheader" className="min-w-0 truncate">
//               Student
//             </div>
//             <div role="columnheader" className="min-w-0 truncate">
//               NIC
//             </div>
//             <div role="columnheader" className="min-w-0 truncate">
//               Enrollment No.
//             </div>
//             <div role="columnheader" className="min-w-0 truncate">
//               Enrolled Date
//             </div>
//             <div role="columnheader" className="min-w-0 truncate"></div>
//           </Table.Header>
//           <Table.Body
//             data={enrollments}
//             render={(enrollment) => (
//               <InstructorEnrollmentRow
//                 enrollment={enrollment}
//                 key={enrollment.id}
//                 courseId={courseId}
//               />
//             )}
//           ></Table.Body>
//         </Table>
//       </div>
//       <Pagination count={total} refetch={getInstructorEnrollments} />
//     </>
//   );
// }

// export default InstructorEnrollmentTable;


// "use client";

// import { useEffect, useState } from "react";
// ]
// type Props = {
//   classId: number;
// };

// export default function InstructorEnrollmentTable({ classId }: Props) {
//   const [rows, setRows] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function load() {
//       setLoading(true);
//       const data = await getClassEnrollments(classId);
//       setRows(data);
//       setLoading(false);
//     }

//     load();
//   }, [classId]);

//   if (loading) return <p className="p-4">Loading...</p>;

//   if (!rows.length)
//     return <p className="p-4 text-gray-500">No students enrolled</p>;

//   return (
//     <div className="overflow-x-auto border bg-white">
//       <table className="w-full text-sm">
//         <thead className="bg-gray-100 text-left">
//           <tr>
//             <th className="p-3">Student</th>
//             <th className="p-3">NIC</th>
//             <th className="p-3">Enrollment ID</th>
//             <th className="p-3">Enrolled Date</th>
//             <th className="p-3">Active Month</th>
//             <th className="p-3">Status</th>
//           </tr>
//         </thead>

//         <tbody>
//           {rows.map((row) => (
//             <tr key={row.id} className="border-t">
//               <td className="p-3">
//                 {row.student.firstName} {row.student.lastName}
//               </td>

//               <td className="p-3">
//                 {row.student.user?.NIC ?? "-"}
//               </td>

//               <td className="p-3 font-semibold">
//                 {row.enrollmentNumber}
//               </td>

//               <td className="p-3">
//                 {new Date(row.enrolledAt).toLocaleDateString()}
//               </td>

//               <td className="p-3">
//                 {row.activeMonth ?? "-"}
//               </td>

//               <td className="p-3">
//                 <span
//                   className={
//                     row.enrollmentStatus === "ACTIVE"
//                       ? "text-green-600 font-medium"
//                       : "text-red-500 font-medium"
//                   }
//                 >
//                   {row.enrollmentStatus}
//                 </span>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }