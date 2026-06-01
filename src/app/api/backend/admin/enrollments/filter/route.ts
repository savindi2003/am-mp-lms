import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
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

  //  SEARCH
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
            userId: { contains: search, mode: "insensitive" },
          },
        },
      },
    ];
  }

  //  MONTH
  if (month) {
    where.activeMonth = month;
  }

  //  PAID
  if (paid === "paid") {
    where.activeMonth = currentMonth;
  }

  if (paid === "unpaid") {
    where.NOT = { activeMonth: currentMonth };
  }

  //  CLASS TYPE
  if (classTypeId) {
    where.class = {
      classTypeId: Number(classTypeId),
    };
  }

  //  CLASS
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

  return Response.json({ total, enrollments });
}