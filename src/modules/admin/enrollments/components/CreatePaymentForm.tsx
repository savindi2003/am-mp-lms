
// "use client";

// import { useEffect, useRef, useState } from "react"; // useRef added
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/modules/ui/button";
// import {
//   CreatePaymentFormData,
//   createPaymentSchema,
// } from "@/modules/admin/enrollments/validators/createPaymentSchema";
// import { useCreateEnrollment } from "@/modules/admin/enrollments/hooks/useCreateEnrollment";
// import { useGetCourses } from "@/modules/courses/hooks/useGetCourses";
// import { useGetStudentNICs } from "@/modules/admin/enrollments/hooks/useGetStudentNICs";
// import { localDateTimeInputValue } from "@/modules/admin/enrollments/utils/dateInput";
// import { formatCapital, getCourseName } from "@/modules/shared/utils/helper";
// import { useCourseDays } from "@/modules/admin/enrollments/hooks/useCourseDays";
// import { getEnrollmentByStudentIdForm } from "@/modules/admin/enrollments/data/actions";

// type MinimalEnrollment = {
//   course: { courseFee: number };
//   payments: { amount: number }[];
// };
// type StudentNICItem = {
//   NIC: string;
//   student: { id: number; firstName: string; lastName: string };
// };
// type Course = {
//   id: number;
//   courseType: {
//     name: string;
//     id: number;
//   };
// };

// export default function AddPaymentForm({
//   onCloseModal,
//   getEnrollments,
// }: {
//   onCloseModal?: () => void;
//   getEnrollments: () => Promise<void>;
// }) {
//   const [error, setError] = useState<string | null>(null);
//   const [isEnrollment, setIsEnrollment] = useState<boolean>(false);
//   const [enrollment, setEnrollment] = useState<MinimalEnrollment | null>(null);
//   const [isSettledInstallment, setIsSettledInstallment] =
//     useState<boolean>(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     watch,
//     setError: setFormError,
//     setValue, // used by NIC suggestions
//     trigger, // ensure validation/watchers run immediately
//   } = useForm({
//     resolver: zodResolver(createPaymentSchema(isSettledInstallment)),
//     defaultValues: {
//       NIC: undefined,
//       amount: 0,
//       courseId: undefined,
//       plan: undefined,
//       nextDueAt: "",
//       courseDayId: undefined,
//     },
//     mode: "onBlur",
//   });

//   const plan = watch("plan");
//   const minDue = localDateTimeInputValue(new Date());
//   const courseId = watch("courseId");
//   const NIC = watch("NIC") as string | undefined;

//   const { days: courseDays, loading: daysLoading } = useCourseDays(courseId);
//   const amount = watch("amount");

//   const { createEnrollment, loading } = useCreateEnrollment();
//   const { NICs } = useGetStudentNICs();
//   const { courses } = useGetCourses();

//   const [selectedStudent]: StudentNICItem[] = NICs.filter(
//     (c: StudentNICItem) => c.NIC === NIC,
//   );

//   //  NIC suggestions state
//   const [nicOpen, setNicOpen] = useState(false);
//   const nicQuery = (NIC ?? "").toString();
//   const nicMatches = nicQuery.length
//     ? NICs.filter(({ NIC, student }: StudentNICItem) => {
//         const fullName =
//           `${student.firstName} ${student.lastName}`.toLowerCase();
//         const q = nicQuery.toLowerCase();
//         return NIC.toLowerCase().includes(q) || fullName.includes(q);
//       }).slice(0, 8)
//     : [];

//   //  ref to NIC input so we can mirror DOM value immediately
//   const nicInputRef = useRef<HTMLInputElement | null>(null);

//   useEffect(() => {
//     if (!selectedStudent || !courseId) {
//       setIsEnrollment(false);
//       setEnrollment(null);
//       setIsSettledInstallment(false);
//       return;
//     }

//     const studentId = selectedStudent.student.id;
//     let alive = true;

//     (async () => {
//       const row = await getEnrollmentByStudentIdForm(studentId, courseId);
//       if (!alive) return;
//       setIsEnrollment(Boolean(row));
//       setEnrollment(row);
//       setIsSettledInstallment(false);
//     })();

//     return () => {
//       alive = false;
//     };
//   }, [selectedStudent, courseId]);

//   useEffect(() => {
//     if (!isEnrollment || enrollment === null) return;

//     const totalPay = enrollment.payments.reduce((sum, p) => sum + p.amount, 0);
//     const courseFee = enrollment.course.courseFee;
//     const remeinPay = courseFee - totalPay;
//     const entered = Number(amount ?? 0);

//     if (entered > remeinPay) {
//       setFormError("amount", {
//         type: "validate",
//         message: `Amount cannot exceed remaining fee (${remeinPay})`,
//       });
//       setIsSettledInstallment(false);
//       return;
//     } else if (entered === remeinPay) {
//       setIsSettledInstallment(true);
//     }
//   }, [amount, enrollment, isEnrollment, setFormError]);

//   useEffect(() => {
//     if (!selectedStudent) return;

//     const studentId = selectedStudent.student.id;
//     (async () => {
//       const e = await getEnrollmentByStudentIdForm(studentId, courseId);
//       setIsEnrollment(Boolean(e));
//       setEnrollment(e);
//     })();
//   }, [NIC, courseId, selectedStudent]);

//   const onSubmit = async (values: CreatePaymentFormData) => {
//     setError(null);
//     const [course] = courses.filter((course) => course.id === courseId);
//     if (isEnrollment && plan === "FULL")
//       return setFormError("plan", {
//         type: "validate",
//         message: `Invalid plan`,
//       });
//     if (course.courseFee === values.amount && plan === "INSTALLMENTS") {
//       return setFormError("amount", {
//         type: "validate",
//         message: `Installments plan cannot pay full amount of course Fee at once`,
//       });
//     }

//     const payload: CreatePaymentFormData = {
//       ...values,
//       amount:
//         values.plan === "FULL"
//           ? courses.reduce<number | undefined>(
//               (acc, course) =>
//                 course.id === courseId ? course.courseFee : acc,
//               undefined,
//             )
//           : values.amount,
//       nextDueAt:
//         values.plan === "INSTALLMENTS" &&
//         !isSettledInstallment &&
//         values.nextDueAt
//           ? new Date(values.nextDueAt).toISOString()
//           : undefined,
//       // courseType: courses.reduce(
//       //   (acc: undefined | string, course) =>
//       //     course.id === courseId ? course.courseType : acc,
//       //   undefined,
//       // ),
//       courseType: courses.reduce(
//         (acc: undefined | string, course) =>
//           course.id === courseId ? course.courseType.name : acc,
//         undefined,
//       ),
//     };

//     await createEnrollment(payload);
//     onCloseModal?.();
//     await getEnrollments();
//     reset();
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="w-full max-w-md space-y-4 sm:min-w-sm"
//     >
//       <h3 className="text-lg font-semibold text-slate-700">Add payment</h3>

//       {/*  NIC search with suggestions */}
//       <div className="relative">
//         {(() => {
//           const { ref: nicRegRef, ...nicReg } = register("NIC");
//           return (
//             <input
//               type="text"
//               {...nicReg}
//               ref={(el) => {
//                 nicRegRef(el); // keep RHF's ref
//                 nicInputRef.current = el; // keep DOM ref
//               }}
//               placeholder="Search NIC or name"
//               autoComplete="off"
//               onFocus={() => setNicOpen(true)}
//               onBlur={() => setTimeout(() => setNicOpen(false), 120)}
//               className="w-full border px-3 py-2 text-sm"
//             />
//           );
//         })()}

//         {errors.NIC && (
//           <p className="mt-1 text-xs text-red-600">{errors.NIC.message}</p>
//         )}

//         {nicOpen && nicMatches.length > 0 && (
//           <ul
//             className="mt-1 max-h-48 overflow-auto border bg-white"
//             onMouseDown={(e) => {
//               // prevent input blur but let child handlers run
//               e.preventDefault();
//             }}
//           >
//             {nicMatches.map((item: StudentNICItem) => (
//               <li key={item.NIC}>
//                 <button
//                   type="button"
//                   className="block w-full px-3 py-2 text-left hover:bg-slate-50"
//                   onMouseDown={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();

//                     setValue("NIC", item.NIC, {
//                       shouldDirty: true,
//                       shouldValidate: true,
//                     });

//                     if (nicInputRef.current) {
//                       nicInputRef.current.value = item.NIC; // reflect immediately
//                       nicInputRef.current.focus();
//                     }

//                     trigger("NIC");
//                     setNicOpen(false);
//                   }}
//                   onClick={(e) => {
//                     // some environments only rely on click
//                     e.preventDefault();
//                     e.stopPropagation();
//                     setValue("NIC", item.NIC, {
//                       shouldDirty: true,
//                       shouldValidate: true,
//                     });
//                     if (nicInputRef.current) {
//                       nicInputRef.current.value = item.NIC;
//                       nicInputRef.current.focus();
//                     }
//                     trigger("NIC");
//                     setNicOpen(false);
//                   }}
//                 >
//                   {item.NIC} — {item.student.firstName} {item.student.lastName}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* Course select (unchanged) */}
//       <div>
//         <select
//           {...register("courseId", {
//             setValueAs: (v) => (v === "" ? undefined : Number(v)),
//           })}
//           defaultValue=""
//           className="w-full border px-3 py-2 text-sm"
//         >
//           <option value="" className="bg-slate-600 text-slate-200">
//             Select course
//           </option>
//           {courses.map((c: Course) => (
//             <option key={c.id} value={c.id}>
//               {getCourseName(c.courseType.name)}
//             </option>
//           ))}
//         </select>
//         {errors.courseId && (
//           <p className="mt-1 text-xs text-red-600">{errors.courseId.message}</p>
//         )}
//       </div>

//       {/* Course day (unchanged) */}
//       {courseId && !isEnrollment && (
//         <div>
//           <select
//             {...register("courseDayId", {
//               valueAsNumber: true,
//               shouldUnregister: true,
//             })}
//             className="w-full border px-3 py-2 text-sm"
//             disabled={daysLoading || courseDays.length === 0}
//           >
//             <option value="">
//               {daysLoading ? "Loading days..." : "Select course day"}
//             </option>
//             {courseDays.map((d) => (
//               <option key={d.id} value={d.id}>
//                 {formatCapital(d.day)}
//               </option>
//             ))}
//           </select>
//           {errors.courseDayId && (
//             <p className="mt-1 text-xs text-red-600">
//               {errors.courseDayId.message}
//             </p>
//           )}
//         </div>
//       )}

//       {/* Plan (unchanged) */}
//       <div>
//         <select
//           {...register("plan")}
//           className="w-full border px-3 py-2 text-sm"
//         >
//           <option value="" className="bg-slate-600 text-slate-200">
//             Select Plan
//           </option>
//           <option value="FULL">Full payment</option>
//           <option value="INSTALLMENTS">Installments</option>
//         </select>
//         {errors.plan && (
//           <p className="mt-1 text-xs text-red-600">* Select a payment plan</p>
//         )}
//       </div>

//       {/* Amount (unchanged) */}
//       {plan === "INSTALLMENTS" && (
//         <div>
//           <input
//             {...register("amount", {
//               valueAsNumber: true,
//               shouldUnregister: true,
//             })}
//             type="number"
//             placeholder="Amount"
//             className="w-full border px-3 py-2 text-sm"
//           />
//           {errors.amount && (
//             <p className="mt-1 text-xs text-red-600">{errors.amount.message}</p>
//           )}
//         </div>
//       )}

//       {/* Due date (unchanged) */}
//       {plan === "INSTALLMENTS" && !isSettledInstallment && (
//         <div>
//           <input
//             {...register("nextDueAt", { shouldUnregister: true })}
//             min={minDue}
//             step={60}
//             type="datetime-local"
//             className="w-full border px-3 py-2 text-sm"
//           />
//           {errors.nextDueAt && (
//             <p className="mt-1 text-xs text-red-600">
//               {errors.nextDueAt.message as string}
//             </p>
//           )}
//         </div>
//       )}

//       {error && <p className="text-sm text-red-600">{error}</p>}

//       <div className="flex justify-end gap-3">
//         <Button type="button" variant="secondary" onClick={onCloseModal}>
//           Cancel
//         </Button>
//         <Button disabled={loading}>{loading ? "Creating..." : "Create"}</Button>
//       </div>
//     </form>
//   );
// }
