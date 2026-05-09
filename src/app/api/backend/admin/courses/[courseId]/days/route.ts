import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // adjust import

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const courseId = Number((await params).courseId);
  if (!Number.isFinite(courseId)) {
    return NextResponse.json({ error: "Invalid course id" }, { status: 400 });
  }

  const days = await prisma.courseDay.findMany({
    where: { courseId },
    select: { id: true, day: true }, // day is your Weekday enum
    orderBy: { day: "asc" },
  });
  return NextResponse.json(days, { status: 200 });
}
