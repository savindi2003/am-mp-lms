import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Context = {
  params: Promise<{
    courseId: string;
  }>;
};

export async function GET(
  _req: Request,
  context: Context
) {
  const { courseId } = await context.params;

  const links = await prisma.courseLectureLink.findMany({
    where: { classId: Number(courseId) },
    orderBy: [{ lectureDate: "asc" }],
  });

  return NextResponse.json(links);
}