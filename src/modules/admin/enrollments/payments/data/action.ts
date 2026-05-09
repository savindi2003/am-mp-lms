import { prisma } from "@/lib/db";

export async function getAdminPayments(enrollmentId: number) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    select: {
      enrollmentNumber: true,
    },
  });

  const payments = await prisma.payment.findMany({
    where: {
      paymentClasses: {
        some: {
          enrollmentId,
        },
      },
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