import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request, { params }: any) {
  try {
    const classId = Number(params.classId);

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);

    const pageSize = 10;

    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        where: { classId },
        include: {
          student: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { enrolledAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),

      prisma.enrollment.count({
        where: { classId },
      }),
    ]);

    return NextResponse.json({
      enrollments,
      total,
    });
  } catch (err: any) {
    console.error("API ERROR:", err);
    return NextResponse.json(
      { error: "Server Error", detail: err.message },
      { status: 500 },
    );
  }
}