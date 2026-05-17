import { prisma } from "@/lib/db";
import { addStudentToClass, removeStudentFromClass } from "@/services/meeting-service";

export async function syncEnrollmentToGoogle(enrollmentId: number, month: string) {
  const access = await prisma.enrollmentMonthAccess.findFirst({
    where: { enrollmentId, month },
    include: {
      enrollment: {
        include: {
          student: { include: { user: true } },
          class: true,
        },
      },
    },
  });

  if (!access) return;

  const email = access.enrollment.student.user.email;
  const googleEventId = access.enrollment.class.googleEventId;

  if (!googleEventId || !email) return;

  // OVERRIDDEN or PAID → ADD
  if (access.status === "PAID" || access.status === "OVERRIDDEN") {
    await addStudentToClass(googleEventId, email);
  }

  //  REVOKED → REMOVE
  if (access.status === "REVOKED") {
    await removeStudentFromClass(googleEventId, email);
  }
}