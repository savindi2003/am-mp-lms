// import { prisma } from "@/lib/db";
// import { auth } from "@/app/auth";
// import { NextResponse } from "next/server";

// export async function GET(
//   _req: Request,
//   { params }: { params: Promise<{ courseId: string; videoId: string }> },
// ) {
//   const session = await auth();
//   if (!session?.user?.id)
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   const role = session.user.role;
//   if (role !== "ADMIN" && role !== "INSTRUCTOR") {
//     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//   }

//   const courseId = Number((await params).courseId);
//   const videoId = (await params).videoId;
//   if (!Number.isFinite(courseId) || !videoId) {
//     return NextResponse.json({ error: "Invalid params" }, { status: 400 });
//   }

//   const rows = await prisma.enrollment.findMany({
//     where: { courseId },
//     select: {
//       id: true,
//       plan: true,
//       nextDueAt: true,
//       student: {
//         select: { firstName: true, lastName: true },
//       },
//       payments: { select: { amount: true } },
//       course: { select: { courseFee: true } },
//       //  only the access row for THIS video
//       videoAccessControl: {
//         where: { videoId },
//         select: { isAccessed: true },
//         take: 1,
//       },
//     },
//     orderBy: { id: "asc" },
//   });

//   const data = rows.map((r) => ({
//     id: r.id,
//     plan: r.plan,
//     nextDueAt: r.nextDueAt,
//     student: r.student, // { firstName, lastName, enrollmentNo }
//     courseFee: r.course.courseFee,
//     totalPaid: r.payments.reduce((s, p) => s + p.amount, 0),
//     isAccessed: r.videoAccessControl[0]?.isAccessed === true, //  boolean
//   }));
//   return NextResponse.json(data);
// }

// // PATCH stays as you wrote (returns { enrollmentId, videoId, isAccessed })

// type Body = { enrollmentId?: number; isAccessed?: boolean };

// export async function PATCH(
//   req: Request,
//   { params }: { params: Promise<{ courseId: string; videoId: string }> },
// ) {
//   const session = await auth();
//   if (!session?.user?.id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
//   const role = session.user.role;
//   if (role !== "ADMIN") {
//     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//   }

//   const courseId = Number((await params).courseId);
//   const videoId = (await params).videoId; // cuid string
//   if (!Number.isFinite(courseId) || !videoId) {
//     return NextResponse.json({ error: "Invalid params" }, { status: 400 });
//   }

//   const { enrollmentId, isAccessed } = (await req
//     .json()
//     .catch(() => ({}))) as Body;

//   // IMPORTANT: check types, not truthiness (false is valid)
//   if (
//     !Number.isFinite(enrollmentId as number) ||
//     typeof isAccessed !== "boolean"
//   ) {
//     return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
//   }

//   // Optional safety: ensure the enrollment is for this course
//   const ok = await prisma.enrollment.findFirst({
//     where: { id: enrollmentId!, courseId },
//     select: { id: true },
//   });
//   if (!ok) {
//     return NextResponse.json(
//       { error: "Enrollment not in this course" },
//       { status: 400 },
//     );
//   }

//   // Upsert the access row
//   const updated = await prisma.videoAccessControl.upsert({
//     where: { enrollmentId_videoId: { enrollmentId: enrollmentId!, videoId } },
//     create: { enrollmentId: enrollmentId!, videoId, isAccessed },
//     update: { isAccessed },
//     select: { enrollmentId: true, videoId: true, isAccessed: true },
//   });

//   return NextResponse.json(updated);
// }

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
  });
}