
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { addStudentToClass } from "@/services/meeting-service";

export async function POST(req: Request) {
  const body = await req.json();

  const { studentId, classIds, month, amount } = body;

  const payment = await prisma.payment.create({
    data: {
      studentId,
      amount,
      month,
    },
  });

  for (const classId of classIds) {

    const enrollment = await prisma.enrollment.upsert({
      where: {
        studentId_classId: {
          studentId,
          classId,
        },
      },
      update: {},
      create: {
        studentId,
        classId,
        enrollmentNumber: `ENR-${Date.now()}`,
      },
    });

    
    await prisma.enrollmentMonthAccess.upsert({
      where: {
        enrollmentId_month: {
          enrollmentId: enrollment.id,
          month,
        },
      },
      update: {
        status: "PAID",
        revokedAt: null,
      },
      create: {
        enrollmentId: enrollment.id,
        studentId,
        classId,
        month,
        status: "PAID",
      },
    });
  }

  return NextResponse.json({ success: true });
}