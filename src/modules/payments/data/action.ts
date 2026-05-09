// import "server-only";
// import { prisma } from "@/lib/db";
// import { auth } from "@/app/auth";
// import { Prisma } from "@prisma/client";
// import type { PaymentSummary } from "@/modules/payments/types/typePaymentSummary";

// const paymentSummarySelect = Prisma.validator<Prisma.EnrollmentFindManyArgs>()({
//   select: {
//     id: true,
//     courseId: true,
//     nextDueAt: true,
//     course: {
//       select: {
//         id: true,
//         courseType: {
//           select: {
//             name: true,
//             id: true,
//           },
//         },
//         photo: true,
//         courseFee: true,
//       },
//     },
//     payments: { select: { id: true, amount: true, createdAt: true } },
//   },
// });

// function mapToSummary(
//   e: Prisma.EnrollmentGetPayload<typeof paymentSummarySelect>,
// ): PaymentSummary {
//   const paidTotal = e.payments.reduce((sum, p) => sum + p.amount, 0);
//   const lastPaymentAt =
//     e.payments.length > 0
//       ? e.payments.reduce(
//           (latest, p) => (p.createdAt > latest ? p.createdAt : latest),
//           e.payments[0].createdAt,
//         )
//       : undefined;

//   return {
//     courseId: e.course.id,
//     courseType: {
//       id: e.course.courseType.id,
//       name: e.course.courseType.name,
//     },
//     photo: e.course.photo,
//     courseFee: e.course.courseFee,
//     paidTotal,
//     nextDueAt: e.nextDueAt?.toISOString(),
//     outstanding: e.course.courseFee - paidTotal,
//     lastPaymentAt: lastPaymentAt?.toISOString(),
//   };
// }

// export async function getPaymentsSummaryByStudentId(
//   studentId: number,
// ): Promise<PaymentSummary[]> {
//   const enrollments = await prisma.enrollment.findMany({
//     where: { studentId },
//     ...paymentSummarySelect,
//     orderBy: { id: "asc" },
//   });
//   return enrollments.map(mapToSummary);
// }

// export async function getPaymentsSummaryForCurrentUser(): Promise<
//   PaymentSummary[]
// > {
//   const session = await auth();
//   if (!session?.user?.id) throw new Error("Unauthorized");

//   const student = await prisma.student.findUnique({
//     where: { userId: Number(session.user.id) },
//     select: { id: true },
//   });
//   if (!student) return [];

//   return getPaymentsSummaryByStudentId(student.id);
// }


import { prisma } from "@/lib/db";
import { auth } from "@/app/auth";

export async function getStudentPayments() {
  const session = await auth(); // ✅ ONLY SERVER PAGE CALLS THIS

  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = Number(session.user.id);

  const student = await prisma.student.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!student) return [];

  const payments = await prisma.paymentClass.findMany({
    where: {
      Enrollment: {
        studentId: student.id,
      },
    },
    select: {
      paymentId: true,
      class: {
        select: {
          description: true,
          classType: { select: { name: true } },
        },
      },
      Enrollment: {
        select: { enrollmentNumber: true },
      },
      payment: {
        select: {
          amount: true,
          month: true,
          createdAt: true,
        },
      },
    },
  });

  return payments.map((p) => ({
    paymentId: p.paymentId,
    classTypeName: p.class.classType.name,
    description: p.class.description,
    enrollmentId: p.Enrollment?.enrollmentNumber ?? "",
    month: p.payment.month,
    paidAmount: p.payment.amount,
    paidDate: p.payment.createdAt.toISOString(),
  }));
}