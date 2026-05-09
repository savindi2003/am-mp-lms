import { prisma } from "@/lib/db";

export async function getClassTypes() {
  return prisma.classType.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: { id: "asc" },
  });
}

export async function getClassesByType(classTypeId: number) {
  return prisma.class.findMany({
    where: { classTypeId },
    select: {
      id: true,
      classFee: true,
      description: true,
      month: true,
      classType: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
  });
}

export type ClassRange = "TODAY" | "7D" | "30D";

function getDateRange(range: ClassRange) {
  const now = new Date();
  const start = new Date();

  if (range === "TODAY") {
    start.setHours(0, 0, 0, 0);
  }

  if (range === "7D") {
    start.setDate(now.getDate() - 7);
  }

  if (range === "30D") {
    start.setDate(now.getDate() - 30);
  }

  return { start, end: now };
}

export async function getClassPerformance(
  classId: number,
  range: ClassRange = "TODAY",
) {
  const { start, end } = getDateRange(range);

  // =========================
  // 1. CLASS INFO
  // =========================
  const classInfo = await prisma.class.findUnique({
    where: { id: classId },
    select: {
      id: true,
      description: true,
      classFee: true,
      month: true,
      classType: {
        select: {
          id: true,
          name: true,
        },
      },
      instructor: {
        select: {
          firstName: true,
          lastName: true,
          title: true,
        },
      },
    },
  });

  if (!classInfo) throw new Error("Class not found");

  // =========================
  // 2. TOTAL STUDENTS (ALL TIME)
  // =========================
  const totalStudents = await prisma.enrollment.count({
    where: { classId },
  });

  // =========================
  // 3. ACTIVE STUDENTS
  // =========================
  const activeStudents = await prisma.enrollment.count({
    where: {
      classId,
      enrollmentStatus: "ACTIVE",
    },
  });

  // =========================
  // 4. ENROLLMENTS (RANGE)
  // =========================
  const enrollments = await prisma.enrollment.count({
    where: {
      classId,
      enrolledAt: {
        gte: start,
        lte: end,
      },
    },
  });

  // =========================
  // 5. PAYMENTS (RANGE)
  // =========================
  const payments = await prisma.paymentClass.findMany({
    where: {
      classId,
      payment: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    },
    select: {
      paymentId: true,
      payment: {
        select: {
          amount: true,
        },
      },
    },
  });

  // total revenue
  const revenue = payments.reduce(
    (sum, p) => sum + p.payment.amount,
    0,
  );

  // unique payment count
  const paymentCount = new Set(
    payments.map((p) => p.paymentId),
  ).size;

  // =========================
  // RETURN DTO
  // =========================
  return {
    classInfo,

    totalStudents,
    activeStudents,

    enrollments,
    revenue,
    payments: paymentCount,
  };
}