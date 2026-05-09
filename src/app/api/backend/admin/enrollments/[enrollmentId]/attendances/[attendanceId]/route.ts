import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(
  _req: Request,
  {
    params,
  }: { params: Promise<{ enrollmentId: string; attendanceId: string }> },
) {
  try {
    const enrollmentId = parseInt((await params).enrollmentId, 10);
    const attendanceId = parseInt((await params).attendanceId, 10);

    if (
      !Number.isFinite(enrollmentId) ||
      enrollmentId <= 0 ||
      !Number.isFinite(attendanceId) ||
      attendanceId <= 0
    ) {
      return NextResponse.json({ error: "Invalid ids" }, { status: 400 });
    }

    // only delete if it belongs to this enrollment
    const result = await prisma.attendance.deleteMany({
      where: { id: attendanceId, enrollmentId },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Attendance not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { ok: true, deletedId: attendanceId },
      { status: 200 },
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err) {
    console.error("DELETE attendance error:", err);
    return NextResponse.json(
      { error: "Failed to delete Attendance" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: { params: Promise<{ enrollmentId: string; attendanceId: string }> },
) {
  try {
    const enrollmentId = parseInt((await params).enrollmentId, 10);
    const attendanceId = parseInt((await params).attendanceId, 10);
    if (
      !Number.isFinite(enrollmentId) ||
      enrollmentId <= 0 ||
      !Number.isFinite(attendanceId) ||
      attendanceId <= 0
    ) {
      return NextResponse.json({ error: "Invalid ids" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const { present, weekNo } = body ?? {};
    if (
      typeof present !== "boolean" ||
      !Number.isInteger(weekNo) ||
      weekNo <= 0
    ) {
      return NextResponse.json(
        { error: "status and weekNo are required" },
        { status: 400 },
      );
    }

    // Ensure the record exists and belongs to this enrollment
    const existing = await prisma.attendance.findUnique({
      where: { id: attendanceId },
      select: { id: true, enrollmentId: true },
    });
    if (!existing || existing.enrollmentId !== enrollmentId) {
      return NextResponse.json(
        { error: "Attendance not found" },
        { status: 404 },
      );
    }

    // Update (handles simple case). Unique (enrollmentId, weekNo) conflicts are caught below.
    try {
      const updated = await prisma.attendance.update({
        where: { id: attendanceId },
        data: { present, weekNo, markedAt: new Date() },
      });
      return NextResponse.json(updated, { status: 200 });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      // Unique constraint on (weekNo, enrollmentId)
      if (e?.code === "P2002") {
        return NextResponse.json(
          { error: "Attendance for this week already exists for this student" },
          { status: 409 },
        );
      }
      throw e;
    }
  } catch (err) {
    console.error("PATCH attendance error:", err);
    return NextResponse.json(
      { error: "Failed to update Attendance" },
      { status: 500 },
    );
  }
}
