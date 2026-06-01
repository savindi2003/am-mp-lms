import "server-only";
import { auth } from "@/app/auth";
import { prisma } from "@/lib/db";
import {
  AdminUserDTO,
  CurrentUserDTO,
  InstructorUserDTO,
  StudentUserDTO,
} from "@/modules/shared/dto/User.dto";
import { EnrollmentStatus } from "@prisma/client";

export type Role = "STUDENT" | "INSTRUCTOR" | "ADMIN" | null;

export async function getCurrentUser(): Promise<CurrentUserDTO | null> {
  const session = await auth();
  const id = Number(session?.user?.id);
  if (!id) return null;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      student: true,
      instructor: true,
      admin: true,
    },
  });
  if (!user) return null;

  // Normalize common fields
  const common = {
    id: user.id,
    email: user.email,
    NIC: user.NIC,
    userId: user.userId ?? null,
    photo: user.photo ?? null,
    createdAt: user.createdAt.toISOString(),
  };

  switch (user.role) {
    case "STUDENT": {
      const dto: StudentUserDTO = {
        ...common,
        role: "STUDENT", // literal
        student: user.student
          ? {
              id: user.student.id,
              userId: user.student.userId ?? null,
              firstName: user.student.firstName,
              lastName: user.student.lastName,
              createdAt: user.student.createdAt.toISOString(),
            }
          : null,
        instructor: null, // other branches set to null
        admin: null,
      };
      return dto;
    }

    case "INSTRUCTOR": {
      const dto: InstructorUserDTO = {
        ...common,
        role: "INSTRUCTOR",
        student: null,
        instructor: user.instructor
          ? {
              id: user.instructor.id,
              userId: user.instructor.userId ?? null,
              firstName: user.instructor.firstName,
              lastName: user.instructor.lastName,
              title: user.instructor.title,
              createdAt: user.instructor.createdAt.toISOString(),
            }
          : null,
        admin: null,
      };
      return dto;
    }

    case "ADMIN": {
      const dto: AdminUserDTO = {
        ...common,
        role: "ADMIN",
        student: null,
        instructor: null,
        admin: user.admin
          ? {
              id: user.admin.id,
              userId: user.admin.userId ?? null,
              firstName: user.admin.firstName,
              lastName: user.admin.lastName,
              createdAt: user.admin.createdAt.toISOString(),
            }
          : null,
      };
      return dto;
    }
  }
}

export async function updateEnrollmentStatusById(
  id: number,
  enrollmentStatus: EnrollmentStatus,
) {
  await prisma.enrollment.update({
    where: { id },
    data: { enrollmentStatus },
  });
}

export async function updateEnrollmentCourseDay(
  id: number,
  courseDayId: number,
) {
  await prisma.enrollment.update({
    where: { id },
    data: { courseDayId },
  });
}
