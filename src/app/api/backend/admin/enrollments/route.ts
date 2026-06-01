import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const month = searchParams.get("month");
    const paid = searchParams.get("paid");
    const classTypeId = searchParams.get("classTypeId");
    const classId = searchParams.get("classId");

    const currentMonth = new Date().toISOString().slice(0, 7);

    const status = searchParams.get("status");

    const where: any = {
      AND: [],
    };

    
    if (search) {
      where.AND.push({
        OR: [
          {
            student: {
              firstName: { contains: search, mode: "insensitive" },
            },
          },
          {
            student: {
              lastName: { contains: search, mode: "insensitive" },
            },
          },
          {
            student: {
              user: {
                userId: { contains: search, mode: "insensitive" },
              },
            },
          },
        ],
      });
    }

    
    if (month) {
      where.AND.push({
        activeMonth: month,
      });
    }

    
    if (paid === "paid") {
      where.AND.push({
        activeMonth: currentMonth,
      });
    }

    if (paid === "unpaid") {
      where.AND.push({
        OR: [
          { activeMonth: { not: currentMonth } },
          { activeMonth: null },
        ],
      });
    }

    if (status) {
  where.AND.push({
    enrollmentStatus: status,
  });
}

    
    if (classTypeId) {
      where.AND.push({
        class: {
          classTypeId: Number(classTypeId),
        },
      });
    }

    
    if (classId) {
      where.AND.push({
        classId: Number(classId),
      });
    }

    const finalWhere = where.AND.length ? where : {};

    const enrollments = await prisma.enrollment.findMany({
      where: finalWhere,
      orderBy: { enrolledAt: "desc" },
      include: {
        student: {
          include: { user: true },
        },
        class: {
          include: {
            classType: true,
          },
        },
      },
    });

    return NextResponse.json({ enrollments });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}