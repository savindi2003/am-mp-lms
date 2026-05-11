import { prisma } from "@/lib/db";

export async function getAdminPayments(enrollmentId: number) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    select: {
      studentId: true,
      enrollmentNumber: true,
    },
  });

  if (!enrollment) {
    return {
      enrollment: null,
      payments: [],
    };
  }

  const payments = await prisma.payment.findMany({
    where: {
      studentId: enrollment.studentId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      paymentClasses: {
        include: {
          class: true,
        },
      },
    },
  });

  return { enrollment, payments };
}