import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { courseId } = await params;

  const cId = Number(courseId);
  const userId = Number(session.user.id);

  // STUDENT
  const student = await prisma.student.findUnique({
    where: {
      userId,
    },
  });

  if (!student) {
    return NextResponse.json(
      { error: "Student not found" },
      { status: 404 }
    );
  }

  // ENROLLMENT
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      studentId: student.id,
      classId: cId,
    },
  });

  if (!enrollment) {
    return NextResponse.json({
      recordings: [],
      accessMap: {},
    });
  }

  // RECORDINGS
  const recordings = await prisma.classRecodings.findMany({
    where: {
      classId: cId,
    },

    orderBy: [
      {
        month: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });

  // ACCESS
  const accessRecords =
    await prisma.enrollmentMonthAccess.findMany({
      where: {
        enrollmentId: enrollment.id,
      },
    });

  // ACCESS MAP
  const accessMap: Record<string, any> = {};

  accessRecords.forEach((r) => {
    accessMap[r.month] = {
      status: r.status,
      reason: r.reason,
    };
  });

  return NextResponse.json({
    recordings,
    accessMap,
  });
}