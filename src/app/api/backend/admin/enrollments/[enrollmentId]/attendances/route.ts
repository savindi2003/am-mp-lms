import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/app/auth";

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

    const attendance = await prisma.attendance.findMany({
      where: { enrollmentId },
      orderBy: { weekNo: "asc" },
      include: {
        enrollment: {
          select: {
            enrollmentNumber: true,
            student: {
              select: {
                firstName: true,
                lastName: true,
                user: { select: { NIC: true } },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(attendance, { status: 200 });
  } catch (error) {
    console.error("Error fetching attendances:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendances" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ enrollmentId: string }> },
) {
  try {
    // session (admin page today; later you can assert role)
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const markedByUserId = Number(session.user.id);

    // path param
    const enrollmentId = parseInt((await params).enrollmentId, 10);
    if (!Number.isFinite(enrollmentId) || enrollmentId <= 0) {
      return NextResponse.json(
        { error: "Invalid enrollmentId" },
        { status: 400 },
      );
    }

    // payload { present: boolean | "true"/"false", markedByUserId?: number }
    const body = await req.json();
    const rawPresent = body?.present;
    const present =
      typeof rawPresent === "boolean"
        ? rawPresent
        : typeof rawPresent === "string"
          ? rawPresent.toLowerCase() === "true"
          : null;

    if (present === null) {
      return NextResponse.json(
        { error: "present must be boolean" },
        { status: 400 },
      );
    }

    // find enrollment and derive course/currentWeek
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      select: {
        id: true,
        courseId: true,
        course: { select: { currentWeek: true, totalSessions: true } },
      },
    });
    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 },
      );
    }

    const weekNo = enrollment.course.currentWeek;
    if (weekNo < 1 || weekNo > enrollment.course.totalSessions) {
      return NextResponse.json(
        { error: "Current week is out of bounds" },
        { status: 400 },
      );
    }

    // upsert by unique (weekNo, enrollmentId)
    const attendance = await prisma.attendance.upsert({
      where: {
        weekNo_enrollmentId: { weekNo, enrollmentId },
      },
      create: {
        courseId: enrollment.courseId,
        enrollmentId,
        weekNo,
        present,
        markedByUserId,
      },
      update: {
        present,
        markedByUserId,
        markedAt: new Date(),
      },
      include: {
        enrollment: {
          select: {
            enrollmentNumber: true,
            student: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });

    return NextResponse.json(attendance, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create Attendance" },
      { status: 500 },
    );
  }
}
