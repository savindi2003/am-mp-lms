import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const search = searchParams.get("search");
    const month = searchParams.get("month");
    const paid = searchParams.get("paid");
    const classTypeId = searchParams.get("classTypeId");
    const classId = searchParams.get("classId");

    const take = 10;
    const skip = (page - 1) * take;

    const currentMonth = new Date().toISOString().slice(0, 7);

    const where: any = {};

    // 🔍 SEARCH (Name / NIC)
    if (search) {
      where.OR = [
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
              NIC: { contains: search, mode: "insensitive" },
            },
          },
        },
      ];
    }

    // 📅 MONTH FILTER
    if (month) {
      where.activeMonth = month;
    }

    // 💰 PAID FILTER
    if (paid === "paid") {
      where.activeMonth = currentMonth;
    }

    if (paid === "unpaid") {
      where.NOT = { activeMonth: currentMonth };
    }

    // 🎓 CLASS TYPE (Grade)
    if (classTypeId) {
      where.class = {
        classTypeId: Number(classTypeId),
      };
    }

    // 📚 CLASS
    if (classId) {
      where.classId = Number(classId);
    }

    const [total, enrollments] = await Promise.all([
      prisma.enrollment.count({ where }),

      prisma.enrollment.findMany({
        where,
        skip,
        take,
        orderBy: { enrolledAt: "desc" },
        include: {
          student: {
            include: { user: true },
          },
          class: true,
        },
      }),
    ]);

    return NextResponse.json({ total, enrollments });

  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}