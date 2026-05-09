"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

import { CreatePaymentFormData } from "@/modules/admin/enrollments/validators/createPaymentSchema";

const PAGE_SIZE = Number(process.env.NEXT_PUBLIC_PAGE_SIZE!);

export type CreatePaymentState = {
  ok?: boolean;
  error?: string;
  newEnrollmentId?: number;
};

function createEnrollmentNumber(courseType: string) {
  const currentYear = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000) // 0–999
    .toString()
    .padStart(3, "0");
  const baseYear = 2025;
  const number = currentYear - baseYear + 1;
  const shortCourseType = courseType
    .split("_")
    .map((word) => word[0])
    .join("");

  return `AMA/${shortCourseType}/B${number}/${random}`;
}

export async function createPayment(
  payload: CreatePaymentFormData,
): Promise<CreatePaymentState> {
  try {
    if (payload.courseType === undefined)
      return { error: "Course type not defined" };
    if (payload.amount === undefined) return { error: "Amount not defined" };

    const nextDueAtDate = payload.nextDueAt
      ? new Date(payload.nextDueAt)
      : null;

    const user = await prisma.user.findUnique({
      where: { NIC: payload.NIC },
      select: {
        id: true,
        student: {
          select: {
            id: true,
            enrollments: {
              where: { enrollmentStatus: "ACTIVE", courseId: payload.courseId },
              orderBy: { enrolledAt: "desc" },
              select: {
                id: true,
                course: { select: { courseFee: true } },
                payments: { select: { amount: true } },
              },
              take: 1,
            },
          },
        },
      },
    });
    if (!user || !user.student) return { error: "Student not found" };

    const existingEnrollment = user.student.enrollments[0];
    const entered = Number(payload.amount);

    if (existingEnrollment) {
      const totalPaid =
        existingEnrollment.payments.reduce((sum, p) => sum + p.amount, 0) ?? 0;
      const dueBefore = Math.max(
        existingEnrollment.course.courseFee - totalPaid,
        0,
      );

      if (entered > dueBefore)
        return { error: "Payment amount cannot exceed remaining due" };

      const isFinal = entered >= dueBefore;

      await prisma.$transaction([
        prisma.enrollment.update({
          where: { id: existingEnrollment.id },
          data: { nextDueAt: isFinal ? null : nextDueAtDate },
        }),
        prisma.payment.create({
          data: { amount: entered, enrollmentId: existingEnrollment.id },
        }),
      ]);

      return { ok: true }; // no newEnrollmentId
    }

    // ---- NEW ENROLLMENT ----
    if (!payload.courseId || !payload.courseDayId)
      return { error: "Course and course day is required" };

    const course = await prisma.course.findUnique({
      where: { id: payload.courseId },
      select: { courseFee: true },
    });
    if (!course) return { error: "Course not found" };

    if (entered > course.courseFee)
      return { error: "Payment amount cannot exceed course fee" };

    const isFinal = payload.plan === "FULL" || entered >= course.courseFee;

    // Create enrollment + initial payment
    const created = await prisma.enrollment.create({
      data: {
        enrollmentNumber: createEnrollmentNumber(payload.courseType),
        enrollmentStatus: "ACTIVE",
        studentId: user.student.id,
        courseId: payload.courseId,
        courseDayId: payload.courseDayId,
        plan: payload.plan,
        nextDueAt: isFinal ? null : nextDueAtDate,
      },
      select: { id: true },
    });

    await prisma.payment.create({
      data: { amount: entered, enrollmentId: created.id },
    });

    // IMPORTANT: return the new id
    revalidatePath("/admin/enrollments");
    return { ok: true, newEnrollmentId: created.id };
  } catch (e) {
    return { error: "Failed to create payment" };
  }
}

export async function deleteAdminEnrollment(id: number) {
  await prisma.enrollment.delete({ where: { id } });
}

export async function getAdminEnrollments(page: number, courseTypeId?: number) {
  console.log("COURE", courseTypeId);
  const where = courseTypeId
    ? { course: { courseType: { id: courseTypeId } } }
    : undefined;
  const skip = (page - 1) * PAGE_SIZE;
  const [total, enrollments] = await prisma.$transaction([
    prisma.enrollment.count({ where }),

    prisma.enrollment.findMany({
      where,
      select: {
        id: true,
        enrollmentNumber: true,
        enrollmentStatus: true,
        enrolledAt: true,
        plan: true,
        courseDay: {
          select: {
            day: true,
          },
        },
        nextDueAt: true,
        student: {
          select: {
            firstName: true,
            lastName: true,
            contactNo: true,
            address: true,
            dob: true,
            gender: true,
            guardianContactNo: true,
            guardianFirstName: true,
            guardianLastName: true,
            user: { select: { NIC: true, email: true } },
          },
        },
        course: {
          select: {
            courseType: {
              select: {
                name: true,
                id: true,
              },
            },
            courseFee: true,
            courseDay: {
              select: {
                day: true,
                id: true,
              },
            },
          },
        },
        payments: {
          select: { amount: true }, // StudentRow reduces this to paid sum
        },
      },
      orderBy: { enrolledAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
  ]);
  return { total, enrollments };
}

export async function getStudentNICs() {
  return await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: {
      NIC: true,
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function getEnrollmentByStudentIdForm(
  studentId: number,
  courseId: number,
) {
  "use server";
  return await prisma.enrollment.findFirst({
    where: {
      courseId,
      studentId,
    },
    select: {
      id: true,
      plan: true,
      course: {
        select: {
          courseFee: true,
        },
      },
      payments: {
        select: {
          amount: true,
        },
      },
    },
  });
}

