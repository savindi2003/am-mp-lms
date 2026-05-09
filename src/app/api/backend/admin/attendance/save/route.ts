import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();

  const lectureId = body.lectureId;
  const classId = Number(body.classId); 
  const data = body.data;

  await Promise.all(
    data.map((s: any) =>
      prisma.attendance.upsert({
        where: {
          lectureId_enrollmentId: {
            lectureId,
            enrollmentId: s.enrollmentId,
          },
        },
        update: {
          present: s.present,
        },
        create: {
          lectureId,
          classId,
          enrollmentId: s.enrollmentId,
          studentId: s.studentId,
          present: s.present,
          markedByUserId: 1, // TODO: session user
        },
      })
    )
  );

  return Response.json({ success: true });
}