import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;

    const parsedCourseId = Number(courseId);

    if (isNaN(parsedCourseId)) {
      return NextResponse.json(
        { error: "Invalid courseId" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);

    const limit = 10;

    const skip = (page - 1) * limit;

    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        where: {
          courseId: parsedCourseId,
        },

        include: {
          student: {
            include: {
              user: true,
            },
          },
        },

        skip,

        take: limit,

        orderBy: {
          enrolledAt: "desc",
        },
      }),

      prisma.enrollment.count({
        where: {
          courseId: parsedCourseId,
        },
      }),
    ]);

    return NextResponse.json({
      enrollments,
      total,
    });

  } catch (err: any) {

    return NextResponse.json(
      {
        error: err.message || "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}