
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const classId = Number(searchParams.get("classId"));
  const lectureId = searchParams.get("lectureId");

  if (!classId) return Response.json([]);

  const enrollments = await prisma.enrollment.findMany({
    where: { classId },
    include: {
      student: { include: { user: true } },
    },
  });

  const attendance = await prisma.attendance.findMany({
    where: {
      classId,
      lectureId: lectureId || undefined,
    },
  });

  const data = enrollments.map((e) => {
    const att = attendance.find(
      (a) => a.enrollmentId === e.id
    );

    return {
      enrollmentId: e.id,
      studentId: e.studentId,
      name: e.student.firstName + " " + e.student.lastName,
      nic: e.student.user.NIC,
      userId: e.student.user.userId,
      enrollmentNumber: e.enrollmentNumber,

      //  IMPORTANT PART
      present: att ? att.present : true,
      isSaved: !!att,
    };
  });

  return Response.json(data);
}