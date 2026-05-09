import { prisma } from "@/lib/db";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import type { CourseVideoRow } from "@/modules/courses/[courseId]/types/typeCourseVideo";

export async function getCourseVideosInitial(classId: number) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = Number(session.user.id);

  // 1. student
  const student = await prisma.student.findUnique({
    where: { userId },
  });

  if (!student) return [];

  // 2. check enrollment for THIS class
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      studentId: student.id,
      classId: classId,
    },
  });

  if (!enrollment) return [];

  // 3. videos for class
  const videos = await prisma.courseYoutubeVideo.findMany({
    where: {
      classId: classId, 
      visibility: "PUBLISHED",
    },
    orderBy: [
      { orderIndex: "asc" },
      { createdAt: "asc" },
    ],
  });

  return videos;
}

export async function getCourseById(id: number) {
  const course = await prisma.class.findUnique({
    where: { id },
    include: {
      classType: {
        select: {
          id: true,
          name: true,
        }
      },
      instructor: {
        include: {
          user: true,
        },
      },
    },
  });

  return {
    ...course,
    createdAt: course?.createdAt.toISOString(),
  };
}
export async function getEnrollmentByStudentId(
  userId: number,
  classId: number, //  change from courseId → classId
) {
  return await prisma.enrollment.findFirst({
    where: {
      classId,
      student: { userId },
    },
    select: {
      id: true,
      enrollmentNumber: true,
      enrollmentStatus: true,
      activeMonth: true,

      Attendance: {
        select: {
          present: true,
          lecture: {
            select: {
              id: true,
              title: true,
              lectureDate: true,
            },
          },
        },
        orderBy: {
          lecture: {
            lectureDate: "asc",
          },
        },
      },
    },
  });
}



export async function getStudentAttendance(studentUserId: number, classId: number) {
  const student = await prisma.student.findUnique({
    where: { userId: studentUserId },
    select: { id: true },
  });

  if (!student) return [];

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      studentId: student.id,
      classId,
    },
    select: { id: true },
  });

  if (!enrollment) return [];

  return prisma.attendance.findMany({
    where: {
      enrollmentId: enrollment.id,
    },
    select: {
      present: true,
      lecture: {
        select: {
          id: true,
          title: true,
          lectureDate: true,
        },
      },
    },
    orderBy: {
      lecture: {
        lectureDate: "asc",
      },
    },
  });
}
