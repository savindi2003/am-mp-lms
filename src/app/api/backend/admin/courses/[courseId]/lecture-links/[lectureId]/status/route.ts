import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  context: any
) {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  
  const { courseId, lectureId } = await context.params;

  if (!lectureId) {
    return NextResponse.json(
      { error: "lectureId missing" },
      { status: 400 }
    );
  }

  const { status } = await req.json();

  try {
    const updated = await prisma.courseLectureLink.update({
      where: { id: lectureId },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to update lecture status" },
      { status: 500 }
    );
  }
}