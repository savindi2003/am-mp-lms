import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/lib/db";

// 🔵 GET ONE LECTURE
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ lectureId: string }> },
) {
  const { lectureId } = await params;

  const lecture = await prisma.courseLectureLink.findUnique({
    where: { id: lectureId },
  });

  if (!lecture)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(lecture);
}



// 🟡 UPDATE
// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: { courseId: string; lectureId: string } }
// ) {
//   const session = await auth();

//   if (session?.user.role !== "ADMIN") {
//     return NextResponse.json(
//       { error: "Unauthorized" },
//       { status: 401 }
//     );
//   }

//   const { lectureId } = params; // ❗ NO await

//   const body = await req.json();

//   const updated = await prisma.courseLectureLink.update({
//     where: { id: lectureId },
//     data: {
//       title: body.title,
//       meetingLink: body.meetingLink,

//       lectureDate: body.lectureDate
//         ? new Date(body.lectureDate)
//         : undefined,

//       fromTime:
//         body.lectureDate && body.fromTime
//           ? new Date(`${body.lectureDate}T${body.fromTime}:00`)
//           : undefined,

//       toTime:
//         body.lectureDate && body.toTime
//           ? new Date(`${body.lectureDate}T${body.toTime}:00`)
//           : undefined,

//       month: body.month,
//     },
//   });

//   return NextResponse.json(updated);
// }
type RouteContext = {
  params: Promise<{
    courseId: string;
    lectureId: string;
  }>;
};



export async function PATCH(
  req: Request,
  context: RouteContext
) {
  const { courseId, lectureId } = await context.params;

  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const updated = await prisma.courseLectureLink.update({
    where: { id: lectureId },
    data: {
      title: body.title,
      meetingLink: body.meetingLink,

      lectureDate: body.lectureDate
        ? new Date(body.lectureDate)
        : undefined,

      fromTime: body.fromTime
        ? new Date(`${body.lectureDate}T${body.fromTime}:00`)
        : undefined,

      toTime: body.toTime
        ? new Date(`${body.lectureDate}T${body.toTime}:00`)
        : undefined,

      month: body.month,
    },
  });

  return NextResponse.json(updated);
}

// 🔴 DELETE
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ lectureId: string }> },
) {
  const session = await auth();

  if (session?.user.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { lectureId } = await params;

  await prisma.courseLectureLink.delete({
    where: { id: lectureId },
  });

  return NextResponse.json({ ok: true });
}