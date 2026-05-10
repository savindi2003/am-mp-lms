import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Context = {
  params: Promise<{ courseId: string }>;
};

export async function GET(
  _req: Request,
  context: Context
) {
  const { courseId } = await context.params;

  const recordings = await prisma.classRecodings.findMany({
    where: {
      classId: Number(courseId),
    },
    orderBy: [
      { createdAt: "asc" }
    ],
  });

  return NextResponse.json(recordings);
}