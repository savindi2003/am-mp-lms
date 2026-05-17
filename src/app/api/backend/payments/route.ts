import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const month = searchParams.get("month");
    

    if (!month) {
      return NextResponse.json(
        { error: "Month is required" },
        { status: 400 },
      );
    }

    //  MAIN QUERY
    const payments = await prisma.payment.findMany({
      where: {
        month,
      },

      include: {
        Student: {
          include: {
            user: true,
          },
        },

        paymentClasses: {
          include: {
            class: {
              include: {
                classType: true,
              },
            },
            Enrollment: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },


    });

    //  TOTAL COUNT
    const totalCount = await prisma.payment.count({
      where: { month },
    });

    //  TOTAL EARNINGS
    const totalEarnings =
      await prisma.payment.aggregate({
        where: { month },
        _sum: {
          amount: true,
        },
      });

    //  FORMAT RESPONSE
    const formatted = payments.map((p) => {
      const isPackage =
        p.paymentClasses.length > 1;

      return {
        id: p.id,
        amount: p.amount,
        month: p.month,
        createdAt: p.createdAt,

        student: p.Student
          ? {
              firstName:
                p.Student.firstName,
              lastName:
                p.Student.lastName,
              user: {
                NIC:
                  p.Student.user?.NIC ??
                  null,
              },
            }
          : null,

        type: isPackage
          ? "PACKAGE"
          : "SINGLE",

        classes: p.paymentClasses.map(
          (pc) => ({
            id: pc.class.id,
            name: pc.class.description,
            classType:
              pc.class.classType.name,
          }),
        ),
      };
    });

    return NextResponse.json({
      payments: formatted,

      totalEarnings:
        totalEarnings._sum.amount || 0,


    });
  } catch (err) {
    console.error(
      "Payments API error:",
      err,
    );

    return NextResponse.json(
      { error: "Failed to load payments" },
      { status: 500 },
    );
  }
}