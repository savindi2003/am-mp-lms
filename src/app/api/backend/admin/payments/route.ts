


import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { addStudentToClass } from "@/services/meeting-service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, classIds, month, amount } = body;


    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!student || !student.user.email) {
      return NextResponse.json({ error: "Student or email not found" }, { status: 404 });
    }

    // 2. Payment record එක හදන්න
    const payment = await prisma.payment.create({
      data: {
        studentId: student.id,
        amount,
        month,
      },
    });


    for (const classId of classIds) {
      const enrollment = await prisma.enrollment.upsert({
        where: {
          studentId_classId: {
            studentId: student.id,
            classId,
          },
        },
        update: {
          activeMonth: month,
          enrollmentStatus: "ACTIVE",
        },
        create: {
          studentId: student.id,
          classId,
          enrollmentNumber: `ENR-${Date.now()}-${classId}`,
          activeMonth: month,
          enrollmentStatus: "ACTIVE",
        },
      });

      await prisma.paymentClass.create({
        data: {
          paymentId: payment.id,
          classId,
          enrollmentId: enrollment.id,
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
          studentId: student.id,
          classId,
          month,
          status: "PAID",
        },
      });

      // --- GOOGLE GUEST LIST ADDITION PART ---
      try {

        const classInfo = await prisma.class.findUnique({
          where: { id: classId },
          select: { googleEventId: true }
        });

        if (classInfo?.googleEventId) {

          await addStudentToClass(classInfo.googleEventId, student.user.email);
          console.log(`Added student ${student.user.email} to Google Event ${classInfo.googleEventId}`);
        }
      } catch (googleError) {

        console.error("Error adding student to Google Event:", googleError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Payment API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
