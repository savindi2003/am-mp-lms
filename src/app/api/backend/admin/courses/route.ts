import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/lib/db";
import type { Weekday } from "@prisma/client"; // ✅ use the exported enum type

const WEEKDAY_VALUES = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

function isWeekday(x: unknown): x is Weekday {
  return (
    typeof x === "string" && (WEEKDAY_VALUES as readonly string[]).includes(x)
  );
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      courseTypeId,
      courseTypeName,
      description,
      instructorId,
      courseFee,
      totalSessions,
      days,
      coverImageKey,
    } = body ?? {};

    if (
      !coverImageKey ||
      !description ||
      !instructorId ||
      !courseFee ||
      !totalSessions
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    if (!courseTypeId && !courseTypeName) {
      return NextResponse.json(
        { error: "Provide courseTypeId or courseTypeName" },
        { status: 400 },
      );
    }
    console.log("NAME", courseTypeName);
    // if (courseTypeName) {
    //   const name = courseTypeName;
    //   const exists = await prisma.courseType.findUnique({
    //     where: { name },
    //     select: { id: true },
    //   });
    //   console.log(exists);
    //   if (exists?.id) {
    //     return NextResponse.json(
    //       { error: "This course name already exists" },
    //       { status: 409 },
    //     );
    //   }
    // }

    // ✅ narrow to Weekday[]
    const typedDays: Weekday[] = Array.isArray(days)
      ? Array.from(new Set(days)).filter(isWeekday)
      : [];

    const result = await prisma.$transaction(async (tx) => {
      // 1) resolve CourseType
      let typeId: number | undefined = Number(courseTypeId) || undefined;
      if (
        !typeId &&
        typeof courseTypeName === "string" &&
        courseTypeName.trim()
      ) {
        const ct = await tx.courseType.upsert({
          where: { name: courseTypeName.trim() },
          update: {},
          create: { name: courseTypeName.trim() },
          select: { id: true },
        });
        typeId = ct.id;
      }

      // 2) create Course
      const course = await tx.course.create({
        data: {
          photo: String(coverImageKey),
          description: String(description),
          totalSessions: Number(totalSessions),
          instructorId: Number(instructorId),
          courseFee: Number(courseFee),
          courseTypeId: Number(typeId),
        },
        select: { id: true },
      });

      // 3) create CourseDay rows (enum type matches)
      if (typedDays.length > 0) {
        await tx.courseDay.createMany({
          data: typedDays.map((d) => ({ courseId: course.id, day: d })),
          skipDuplicates: true,
        });
      }

      return { id: course.id };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create Course" },
      { status: 500 },
    );
  }
}
