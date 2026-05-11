import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;

  const parsedCourseId = Number(courseId);

  if (isNaN(parsedCourseId)) {
    return Response.json(
      { error: "Invalid courseId" },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);

  const limit = 10;

  const enrollments = await prisma.enrollment.findMany({
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

    skip: (page - 1) * limit,

    take: limit,

    orderBy: {
      enrolledAt: "desc",
    },
  });

  const total = await prisma.enrollment.count({
    where: {
      courseId: parsedCourseId,
    },
  });

  return Response.json({
    enrollments,
    total,
  });
}