// src/app/api/backend/instructor/class/[classId]/enrollments/route.ts

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ classId: string }> }
) {
  try {
    const { classId } = await params;

    const id = Number(classId);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid classId" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);

    const take = 10;
    const skip = (page - 1) * take;

    const [total, enrollments] = await Promise.all([
      prisma.enrollment.count({
        where: { classId: id },
      }),

      prisma.enrollment.findMany({
        where: { classId: id },
        skip,
        take,
        orderBy: { enrolledAt: "desc" },
        include: {
          student: {
            include: {
              user: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({ total, enrollments });
  } catch (err) {
    return NextResponse.json(
      { error: "Server Error", detail: String(err) },
      { status: 500 }
    );
  }
}