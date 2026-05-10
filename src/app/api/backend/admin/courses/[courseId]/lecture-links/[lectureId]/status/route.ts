import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/lib/db";

type RouteContext = {
  params: Promise<{
    lectureId: string;
  }>;
};

export async function PATCH(
  req: NextRequest,
  context: RouteContext
) {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lectureId } = await context.params;
  const body = await req.json();

  const updated = await prisma.courseLectureLink.update({
    where: { id: lectureId },
    data: {
      status: body.status,
    },
  });

  return NextResponse.json(updated);
}