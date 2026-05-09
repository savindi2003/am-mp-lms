import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/app/auth";

const PAGE_SIZE = Number(process.env.NEXT_PUBLIC_PAGE_SIZE!);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page"));
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const id = Number((await params).courseId);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid courseId" }, { status: 400 });
    }
    const skip = (page - 1) * PAGE_SIZE;

    const [total, course] = await prisma.$transaction([
      prisma.enrollment.count({ where: { courseId: id } }),
      prisma.course.findUnique({
        where: { id },
        select: {
          enrollments: {
            select: {
              id: true,
              enrollmentNumber: true,
              enrolledAt: true,
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
            },
            orderBy: { id: "desc" },
            skip,
            take: PAGE_SIZE,
          },
        },
      }),
    ]);

    if (!course)
      return NextResponse.json({ error: "Course not found" }, { status: 404 });

    const enrollments = course.enrollments;
    return NextResponse.json({ total, enrollments }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch instructor enrollments" },
      { status: 500 },
    );
  }
}
