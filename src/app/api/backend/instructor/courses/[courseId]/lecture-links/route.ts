import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { courseId: string } }
) {
  const courseId = Number(params.courseId);

  const links = await prisma.courseLectureLink.findMany({
    where: { classId: courseId },
    orderBy: [{ lectureDate: "asc" }],
  });

  return NextResponse.json(links);
}