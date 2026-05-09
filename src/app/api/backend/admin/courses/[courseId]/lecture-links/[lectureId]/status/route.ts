import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { lectureId: string } }
) {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lectureId } = params;
  const body = await req.json();

  const updated = await prisma.courseLectureLink.update({
    where: { id: lectureId },
    data: {
      status: body.status, // ✅ now Prisma will accept
    },
  });

  return NextResponse.json(updated);
}