import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/lib/db";
import { fromZonedTime } from "date-fns-tz";

const TIME_ZONE = "Asia/Colombo";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await params;
  const id = Number(courseId);

  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode"); // "all" | "upcoming"

  const whereClause: any = {
    classId: id,
  };

  //  MONTH BASED FILTER
  if (mode === "upcoming") {
    const now = new Date();

    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;

    whereClause.month = {
      gte: currentMonth, //  current month + future months
    };
  }

  const lectures = await prisma.courseLectureLink.findMany({
    where: whereClause,
    orderBy: [
      { month: "asc" },
      { lectureDate: "asc" },
    ],
  });

  return NextResponse.json(lectures);
}

//  CREATE LECTURE
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { courseId } = await params;
  const id = Number(courseId);

  const body = await req.json();

  
  const fromLocal = `${body.lectureDate} ${body.fromTime}`;
  const toLocal = `${body.lectureDate} ${body.toTime}`;

  
  const fromUTC = fromZonedTime(fromLocal, TIME_ZONE);
  const toUTC = fromZonedTime(toLocal, TIME_ZONE);

  const lecture = await prisma.courseLectureLink.create({
    data: {
      classId: id,
      title: body.title,
      meetingLink: body.meetingLink,

      lectureDate: new Date(body.lectureDate),

      fromTime: fromUTC,
      toTime: toUTC,

      uploadedByUserId: Number(session.user.id),
      month: body.month,
    },
  });

  return NextResponse.json(lecture);
}
// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@/app/auth";
// import { prisma } from "@/lib/db";

// export async function GET(
//   _req: Request,
//   { params }: { params: Promise<{ courseId: string }> }
// ) {
//   const session = await auth();
//   const { courseId } = await params;

//   if (!session?.user) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const classId = Number(courseId);
//   const userId = Number(session.user.id);

//   // 1. get student
//   const student = await prisma.student.findUnique({
//     where: { userId },
//   });

//   if (!student) {
//     return NextResponse.json({ error: "Student not found" }, { status: 404 });
//   }

//   // 2. enrollment
//   const enrollment = await prisma.enrollment.findFirst({
//     where: {
//       studentId: student.id,
//       classId,
//     },
//   });

//   if (!enrollment) {
//     return NextResponse.json({
//       lectures: [],
//       accessMap: {},
//     });
//   }

//   // 3. lectures
//   const lectures = await prisma.courseLectureLink.findMany({
//     where: { classId },
//     orderBy: [
//       { month: "asc" },
//       { lectureDate: "asc" },
//     ],
//   });

//   // 4. MONTH ACCESS (IMPORTANT)
//   const accessRecords = await prisma.enrollmentMonthAccess.findMany({
//     where: {
//       enrollmentId: enrollment.id,
//     },
//   });

//   // 5. build access map
//   const accessMap: Record<string, any> = {};

//   accessRecords.forEach((r) => {
//     accessMap[r.month] = {
//       status: r.status,
//       reason: r.reason,
//     };
//   });

//   return NextResponse.json({
//     lectures,
//     accessMap,
//   });
// }