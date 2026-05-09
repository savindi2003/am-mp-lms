import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const param = await params;
  const courseId = Number(param.courseId);
  const videos = await prisma.courseVideo.findMany({
    where: { courseId, status: { not: "DELETED" } },
    orderBy: [{ orderIndex: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      title: true,
      description: true,
      visibility: true,
      status: true,
      s3Key: true,
      durationSeconds: true,
      createdAt: true,
    },
  });
  return NextResponse.json(videos);
}
