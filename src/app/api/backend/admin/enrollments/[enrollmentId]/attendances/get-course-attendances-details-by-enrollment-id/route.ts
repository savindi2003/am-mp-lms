import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ enrollmentId: string }> },
) {
  try {
    const enrollmentId = parseInt((await params).enrollmentId, 10);
    if (!Number.isFinite(enrollmentId) || enrollmentId <= 0) {
      return NextResponse.json(
        { error: "Invalid enrollmentId" },
        { status: 400 },
      );
    }

    const row = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      select: {
        course: {
          select: {
            id: true,
            currentWeek: true,
            totalSessions: true,
          },
        },
      },
    });

    if (!row || !row.course) {
      return NextResponse.json(
        { error: "Enrollment/Course not found" },
        { status: 404 },
      );
    }

    const { id: courseId, currentWeek, totalSessions } = row.course;

    return NextResponse.json(
      { courseId, currentWeek, totalSessions },
      { status: 200 },
    );
  } catch (err) {
    console.error("GET course attendance details error:", err);
    return NextResponse.json(
      { error: "Failed to get course Attendance details" },
      { status: 500 },
    );
  }
}
