
import { prisma } from "@/lib/db";
import { auth } from "@/app/auth";

export async function getStudentPayments() {
  const session = await auth(); //  ONLY SERVER PAGE CALLS THIS

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