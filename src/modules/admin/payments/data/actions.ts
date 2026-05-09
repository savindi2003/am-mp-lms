"use server";

import { prisma } from "@/lib/db";
import { CreatePaymentFormData } from "../validators/createPaymentSchema";
import { PaymentPlan, EnrollmentStatus } from "@prisma/client"; 

export async function createPayment(payload: CreatePaymentFormData) {
  try {
    const { NIC, classIds, month, amount } = payload;

    // 1. Student ID eka hoyaganna
    const user = await prisma.user.findUnique({
      where: { NIC },
      select: { student: { select: { id: true } } },
    });

    if (!user?.student) {
      return { error: "Student not found" };
    }

    const studentId = user.student.id;
    const plan: PaymentPlan = classIds.length > 1 ? PaymentPlan.INSTALLMENTS : PaymentPlan.FULL;
    const feePerClass = Math.floor(amount / classIds.length);

    // SQL Transaction ekak use kireema godak hodai loop ekak athule update wenna nisa
    const results = await prisma.$transaction(async (tx) => {
      for (const classId of classIds) {
        // 2. Enrollment eka thiyeda balanna
        let enrollment = await tx.enrollment.findFirst({
          where: { studentId, classId },
        });

        // 3. Nattan create karanna
        if (!enrollment) {
          enrollment = await tx.enrollment.create({
            data: {
              enrollmentNumber: `ENR-${Date.now()}-${classId}`,
              studentId,
              classId,
              plan,
              agreedTotalFee: feePerClass,
              month: month, // Oyaage schema eke field name eka
              enrollmentStatus: EnrollmentStatus.ACTIVE, // PAID kiyala ekak na schema eke
            },
          });
        }

        // 4. Duplicate payment check
        const exists = await tx.payment.findFirst({
          where: {
            enrollmentId: enrollment.id,
            month: month,
          },
        });

        if (exists) {
          throw new Error(`Already paid for class ${classId} in ${month}`);
        }

        // 5. Payment record eka create karanna
        await tx.payment.create({
          data: {
            enrollmentId: enrollment.id,
            amount: feePerClass,
            month: month,
          },
        });

        // 6. Enrollment eke thiyena current month eka update karanna
        await tx.enrollment.update({
          where: { id: enrollment.id },
          data: {
            month: month,
            enrollmentStatus: EnrollmentStatus.ACTIVE,
          },
        });
      }
    });

    return { ok: true };
  } catch (e: any) {
    console.error("Payment Error:", e.message);
    return { error: e.message || "Failed to create payment" };
  }
}