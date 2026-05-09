// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/db";
// import { auth } from "@/app/auth";
// import { getMonthAccess } from "@/lib/access-control";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { courseId: string } }
// ) {
//   const session = await auth();
//   if (!session?.user) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const classId = Number(params.courseId);
//   const userId = Number(session.user.id);

//   // student
//   const student = await prisma.student.findUnique({
//     where: { userId },
//   });

//   if (!student) {
//     return NextResponse.json([], { status: 404 });
//   }

//   // enrollment
//   const enrollment = await prisma.enrollment.findFirst({
//     where: {
//       studentId: student.id,
//       classId,
//     },
//   });

//   if (!enrollment) return NextResponse.json([]);

//   // lectures
//   const lectures = await prisma.courseLectureLink.findMany({
//     where: { classId },
//     orderBy: [{ month: "asc" }, { lectureDate: "asc" }],
//   });

//   // access records (OLD SCHEMA → NO NEW MODEL)
//   const accessRecords = await prisma.enrollment.findMany({
//     where: {
//       studentId: student.id,
//       classId,
//     },
//   });

//   // map access
//   const result = lectures.map((lec) => {
//     const record = accessRecords.find(
//       (r) => r.activeMonth === lec.month
//     );

//     const access = getMonthAccess({
//       dbRecord: record,
//       lectureMonth: lec.month!,
//     });

//     return {
//       ...lec,
//       access,
//     };
//   });

//   return NextResponse.json(result);
// }

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const session = await auth();
  const { courseId } = await params;

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const classId = Number(courseId);
  const userId = Number(session.user.id);

  // 1. get student
  const student = await prisma.student.findUnique({
    where: { userId },
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  // 2. enrollment
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      studentId: student.id,
      classId,
    },
  });

  if (!enrollment) {
    return NextResponse.json({
      lectures: [],
      accessMap: {},
    });
  }

  // 3. lectures
  const lectures = await prisma.courseLectureLink.findMany({
    where: { classId },
    orderBy: [
      { month: "asc" },
      { lectureDate: "asc" },
    ],
  });

  // 4. MONTH ACCESS (IMPORTANT)
  const accessRecords = await prisma.enrollmentMonthAccess.findMany({
    where: {
      enrollmentId: enrollment.id,
    },
  });

  // 5. build access map
  const accessMap: Record<string, any> = {};

  accessRecords.forEach((r) => {
    accessMap[r.month] = {
      status: r.status,
      reason: r.reason,
    };
  });

  return NextResponse.json({
    lectures,
    accessMap,
  });
}