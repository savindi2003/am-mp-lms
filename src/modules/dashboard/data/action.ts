import { prisma } from "@/lib/db";
import { auth } from "@/app/auth";

import { PaymentPlan } from "@prisma/client";
import type { InstructorCourse } from "@/modules/dashboard/types/typeInstructorCourse";
import { DueExpireItem } from "@/modules/dashboard/types/typeDueExpireItem";

export type DashboardStats = {
  students: number;
  dueExpires: number;
  sales: number;
  totalEnrollments: number;
  payRate: number;
  totals: {
    fee: number;
    paid: number;
    due: number;
  };
};

export const sinceDays = (days: number) => {
  if (days === 0) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return start;
  }

  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
};

export async function getDashboardStats(
  since?: Date,
): Promise<DashboardStats> {
  const now = new Date();
  const gte = since ?? sinceDays(7);

  // =========================
  // 1. BASIC METRICS
  // =========================
  const [students, dueExpires, totalEnrollments] =
    await prisma.$transaction([
      prisma.student.count(),
      prisma.enrollment.count({
        where: {
          enrollmentStatus: "ACTIVE",
          nextDueAt: { lt: now },
        },
      }),
      prisma.enrollment.count({
        where: { enrolledAt: { gte } },
      }),
    ]);

  // =========================
  // 2. SALES (FIXED - ONLY PAYMENT TABLE)
  // =========================
  const paymentAgg = await prisma.payment.aggregate({
    where: {
      createdAt: {
        gte,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const sales = paymentAgg._sum.amount ?? 0;

  // =========================
  // 3. PAY RATE (WINDOW BASED)
  // =========================
  const enrollmentsInWindow = await prisma.enrollment.findMany({
    where: { enrolledAt: { gte } },
    select: {
      id: true,
      class: {
        select: {
          classFee: true,
        },
      },
    },
  });

  const windowIds = enrollmentsInWindow.map((e) => e.id);

  const paymentClasses = await prisma.paymentClass.findMany({
    where: {
      enrollmentId: {
        in: windowIds,
      },
    },
    select: {
      enrollmentId: true,
      payment: {
        select: {
          amount: true,
        },
      },
    },
  });

  const paidMap = paymentClasses.reduce((acc, pc) => {
    if (!pc.enrollmentId) return acc;

    const amount = pc.payment.amount ?? 0;

    acc[pc.enrollmentId] = (acc[pc.enrollmentId] ?? 0) + amount;

    return acc;
  }, {} as Record<number, number>);

  const fullyPaid = enrollmentsInWindow.filter((e) => {
    const fee = e.class.classFee;
    const paid = paidMap[e.id] ?? 0;

    return paid >= fee;
  }).length;

  const payRate =
    enrollmentsInWindow.length > 0
      ? Number(((fullyPaid / enrollmentsInWindow.length) * 100).toFixed(2))
      : 0;

  // =========================
  // 4. ALL TIME TOTALS
  // =========================
  const [allEnrollments, allPaymentClasses] = await prisma.$transaction([
    prisma.enrollment.findMany({
      select: {
        id: true,
        class: {
          select: {
            classFee: true,
          },
        },
      },
    }),
    prisma.paymentClass.findMany({
      select: {
        enrollmentId: true,
        payment: {
          select: {
            amount: true,
          },
        },
      },
    }),
  ]);

  const paidAllMap = allPaymentClasses.reduce((acc, p) => {
    if (!p.enrollmentId) return acc;

    const amount = p.payment.amount ?? 0;

    acc[p.enrollmentId] = (acc[p.enrollmentId] ?? 0) + amount;

    return acc;
  }, {} as Record<number, number>);

  const totals = allEnrollments.reduce(
    (acc, e) => {
      const fee = e.class.classFee;
      const paid = paidAllMap[e.id] ?? 0;

      acc.fee += fee;
      acc.paid += paid;
      acc.due += Math.max(fee - paid, 0);

      return acc;
    },
    { fee: 0, paid: 0, due: 0 },
  );

  // =========================
  // RETURN
  // =========================
  return {
    students,
    dueExpires,
    sales, // ✅ FIXED: ONLY PAYMENT TABLE
    totalEnrollments,
    payRate,
    totals,
  };
}

export async function getEnrollmentsForDashboard(since?: Date) {
  const gte = since ?? sinceDays(7);

  return prisma.enrollment.findMany({
    where: {
      enrolledAt: { gte },
    },
    select: {
      id: true,
      class: {
        select: {
          classType: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      enrolledAt: "desc",
    },
  });
}

export async function getEnrollmentTrend(since?: Date) {
  const gte = since ?? sinceDays(7);

  const enrollments = await prisma.enrollment.findMany({
    where: {
      enrolledAt: { gte },
    },
    select: {
      enrolledAt: true,
    },
    orderBy: {
      enrolledAt: "asc",
    },
  });

  // group by date
  const map = new Map<string, number>();

  enrollments.forEach((e) => {
    const date = new Date(e.enrolledAt)
      .toISOString()
      .split("T")[0]; // YYYY-MM-DD

    map.set(date, (map.get(date) ?? 0) + 1);
  });

  // convert to chart format
  return Array.from(map.entries()).map(([date, count]) => ({
    date,
    enrollments: count,
  }));
}



// export async function getStudentById(id: number) {
//   return prisma.student.findUnique({
//     where: { id },
//     include: {
//     enrollments: {
//       include: {
//         class: {
//           include: {
//             classType: true, 
//             instructor: true,

//           },
//         },
//         Attendance: true,
//       },
//   },
// }
//   });
// } 

// action.ts
export async function getStudentById(id: number) {
  return prisma.student.findUnique({
    where: { userId: id },
    include: {
      enrollments: {
        include: {
          class: {
            include: {
              classType: true,
              instructor: true,
              _count: {
                select: {
                  courseLectureLinks: true, 
                },
              },
            },
          },
          Attendance: true,
        },
      },
    },
  });
}


export async function getCoursesByInstructor(): Promise<InstructorCourse[]> {
  const session = await auth();

  if (!session?.user?.id) throw new Error("Unauthorized");


  const instructor = await prisma.instructor.findUnique({
    where: {
      userId: Number(session.user.id),
    },
  });

  if (!instructor) return [];

const classes = await prisma.class.findMany({
  where: {
    instructorId: instructor.id,
  },
    select: {
      id: true,
      photo: true,
      classFee: true,
      description: true,
      month: true,

      classType: {
        select: {
          id: true,
          name: true,
        },
      },

      instructor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          title: true,
        },
      },

      _count: {
        select: {
          enrollments: true,
          courseYoutubeVideo: true,
          courseResource: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return classes;
}