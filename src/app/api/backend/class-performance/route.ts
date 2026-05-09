import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const classId = Number(searchParams.get("classId"));
  const range = searchParams.get("range") as
    | "TODAY"
    | "7D"
    | "30D";

  const now = new Date();
  const start = new Date();

  if (range === "TODAY") start.setHours(0, 0, 0, 0);
  if (range === "7D") start.setDate(now.getDate() - 7);
  if (range === "30D") start.setDate(now.getDate() - 30);

  const [classInfo, totalStudents, activeStudents, enrollments, payments] =
    await prisma.$transaction([
      prisma.class.findUnique({
        where: { id: classId },
        select: {
          id: true,
          description: true,
          classFee: true,
          classType: {
            select: { name: true },
          },
        },
      }),

      prisma.enrollment.count({ where: { classId } }),

      prisma.enrollment.count({
        where: { classId, enrollmentStatus: "ACTIVE" },
      }),

      prisma.enrollment.count({
        where: {
          classId,
          enrolledAt: { gte: start, lte: now },
        },
      }),

      prisma.paymentClass.findMany({
        where: {
          classId,
          payment: {
            createdAt: { gte: start, lte: now },
          },
        },
        select: {
          paymentId: true,
          payment: { select: { amount: true } },
        },
      }),
    ]);

  const revenue = payments.reduce(
    (sum, p) => sum + p.payment.amount,
    0,
  );

  const paymentCount = new Set(
    payments.map((p) => p.paymentId),
  ).size;

  return Response.json({
    classInfo,
    totalStudents,
    activeStudents,
    enrollments,
    revenue,
    payments: paymentCount,
  });
}