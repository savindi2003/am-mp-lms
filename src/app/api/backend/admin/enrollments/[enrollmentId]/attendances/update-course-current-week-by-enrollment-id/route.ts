import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: Request,
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

    const body = await req.json().catch(() => ({}));
    const currentWeek = Number(body?.currentWeek);
    if (!Number.isInteger(currentWeek) || currentWeek <= 0) {
      return NextResponse.json(
        { error: "currentWeek must be a positive integer" },
        { status: 400 },
      );
    }

    // find course from enrollment (and get totalSessions for a simple bound check)
    const enroll = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      select: { courseId: true, course: { select: { totalSessions: true } } },
    });
    if (!enroll)
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 },
      );

    if (currentWeek > enroll.course.totalSessions) {
      return NextResponse.json(
        {
          error: `currentWeek cannot exceed totalSessions (${enroll.course.totalSessions})`,
        },
        { status: 400 },
      );
    }

    const updated = await prisma.course.update({
      where: { id: enroll.courseId },
      data: { currentWeek },
      select: { id: true, currentWeek: true, totalSessions: true },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("PATCH update currentWeek error:", err);
    return NextResponse.json(
      { error: "Failed to update course week" },
      { status: 500 },
    );
  }
}
