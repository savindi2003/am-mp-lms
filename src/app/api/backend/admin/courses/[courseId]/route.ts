import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/lib/db";
import { Weekday } from "@prisma/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const session = await auth();
    if (session?.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = Number((await params).courseId);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid course id" }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id },
      select: {
        id: true,
        description: true,
        instructorId: true,
        courseFee: true,
        photo: true, // S3 key
        currentWeek: true,
        totalSessions: true,
        courseType: { select: { id: true, name: true } },
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            title: true,
            user: { select: { photo: true } }, // avatar if you need it
          },
        },
        courseDay: { select: { day: true } }, // e.g. [{ day: "MONDAY" }, ...]
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load course" },
      { status: 500 },
    );
  }
}

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const session = await auth();
    if (session?.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = Number((await params).courseId);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid course id" }, { status: 400 });
    }

    const body = await req.json();
    const {
      description,
      instructorId,
      courseFee,
      // choose ONE of these for CourseType change:
      // - courseTypeName: rename current CourseType (keeps same id)
      // - courseTypeId:   re-link to an existing CourseType id
      courseTypeName,
      totalSessions,
      courseTypeId,
      days,
      coverImageKey, // optional new S3 key
    } = body ?? {};

    if (
      !description ||
      !instructorId ||
      !courseFee ||
      !totalSessions ||
      (!courseTypeName && !courseTypeId)
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // fetch current type so we can rename safely if needed
    const current = await prisma.course.findUnique({
      where: { id },
      select: { courseTypeId: true, courseType: { select: { name: true } } },
    });
    if (!current) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // --- Resolve final courseTypeId (rename vs re-link) ---
    let finalCourseTypeId = current.courseTypeId;

    if (typeof courseTypeName === "string") {
      const clean = courseTypeName.trim();
      if (!clean) {
        return NextResponse.json(
          { error: "Course type name is required" },
          { status: 400 },
        );
      }

      const prev = (current.courseType?.name ?? "").trim().toLowerCase();
      const next = clean.toLowerCase();
      const changed = prev !== next;

      if (changed) {
        // if another row already uses this name → 409
        const exists = await prisma.courseType.findUnique({
          where: { name: clean },
          select: { id: true },
        });
        if (exists && exists.id !== current.courseTypeId) {
          return NextResponse.json(
            { error: "This course name already exists" },
            { status: 409 },
          );
        }

        // rename the existing row (keeps the same ID)
        await prisma.courseType.update({
          where: { id: current.courseTypeId },
          data: { name: clean },
        });
      }

      finalCourseTypeId = current.courseTypeId;
    } else if (courseTypeId != null) {
      // re-link to an existing type id
      const maybeId = Number(courseTypeId);
      if (!Number.isInteger(maybeId) || maybeId <= 0) {
        return NextResponse.json(
          { error: "Invalid courseTypeId" },
          { status: 400 },
        );
      }
      const exists = await prisma.courseType.findUnique({
        where: { id: maybeId },
        select: { id: true },
      });
      if (!exists) {
        return NextResponse.json(
          { error: "courseTypeId not found" },
          { status: 400 },
        );
      }
      finalCourseTypeId = maybeId;
    }

    // normalize incoming days
    const typedDays: Weekday[] = Array.isArray(days)
      ? Array.from(new Set(days)).filter(isWeekday)
      : [];

    // ---- Transaction: update course & reconcile days ----
    const result = await prisma.$transaction(async (tx) => {
      // 1) update core fields
      const updated = await tx.course.update({
        where: { id },
        data: {
          description: String(description),
          totalSessions: Number(totalSessions),
          instructorId: Number(instructorId),
          courseFee: Number(courseFee),
          courseTypeId: finalCourseTypeId,
          ...(coverImageKey ? { photo: String(coverImageKey) } : {}),
        },
        select: { id: true },
      });

      // If client didn’t send days, don’t touch them
      if (!Array.isArray(days)) {
        return updated;
      }

      // 2) fetch existing days (+ enrollments)
      const existing = await tx.courseDay.findMany({
        where: { courseId: id },
        select: {
          id: true,
          day: true,
          _count: { select: { Enrollment: true } },
        },
      });

      const existingByDay = new Map<Weekday, { id: number; count: number }>();
      for (const row of existing) {
        existingByDay.set(row.day as Weekday, {
          id: row.id,
          count: row._count.Enrollment,
        });
      }

      const incomingSet = new Set<Weekday>(typedDays);

      // 3) create missing days
      const createdByDay = new Map<Weekday, number>();
      for (const d of typedDays) {
        if (!existingByDay.has(d)) {
          const row = await tx.courseDay.upsert({
            where: { courseId_day: { courseId: id, day: d } },
            update: {},
            create: { courseId: id, day: d },
            select: { id: true, day: true },
          });
          createdByDay.set(row.day as Weekday, row.id);
        }
      }

      // choose a target day for reassignment (first incoming)
      let targetDayId: number | null = null;
      if (incomingSet.size > 0) {
        const firstIncoming = Array.from(incomingSet)[0];
        targetDayId =
          existingByDay.get(firstIncoming)?.id ??
          createdByDay.get(firstIncoming) ??
          null;
      }

      // 4) determine which to delete
      const toDelete = existing.filter(
        (row) => !incomingSet.has(row.day as Weekday),
      );

      // block removing ALL days if any enrollments exist
      if (incomingSet.size === 0) {
        const hasEnrollments = existing.some((r) => r._count.Enrollment > 0);
        if (hasEnrollments) {
          throw new Error(
            "Cannot remove all course days while enrollments exist. Move or drop enrollments first.",
          );
        }
      }

      // 5) reassign enrollments (if any) then delete
      for (const row of toDelete) {
        if (row._count.Enrollment > 0) {
          if (!targetDayId) {
            throw new Error(
              `Day ${row.day} has enrollments. Add at least one new day to reassign or keep this day.`,
            );
          }
          await tx.enrollment.updateMany({
            where: { courseDayId: row.id },
            data: { courseDayId: targetDayId },
          });
        }
        await tx.courseDay.delete({ where: { id: row.id } });
      }

      return updated;
    });

    return NextResponse.json(result, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    const msg = e?.message ?? "Failed to update Course";
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    if (
      msg.includes("Cannot remove all course days") ||
      msg.includes("has enrollments")
    ) {
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update Course" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const session = await auth();
    if (session?.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = Number((await params).courseId);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid course id" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // fetch course first to get its courseTypeId
      const course = await tx.course.findUnique({
        where: { id },
        select: { id: true, courseTypeId: true },
      });
      if (!course) throw new Error("NOT_FOUND");

      // 1) remove enrollments explicitly due to FK on Enrollment.courseDayId
      await tx.enrollment.deleteMany({ where: { courseId: id } });

      // 2) delete the course (cascades clean up dependents like CourseDay, etc.)
      await tx.course.delete({ where: { id } });

      // 3) if no courses left for this type, delete the CourseType row
      let deletedCourseTypeId: number | null = null;
      const remaining = await tx.course.count({
        where: { courseTypeId: course.courseTypeId },
      });
      if (remaining === 0) {
        await tx.courseType.delete({ where: { id: course.courseTypeId } });
        deletedCourseTypeId = course.courseTypeId;
      }

      return { id, deletedCourseTypeId };
    });

    return NextResponse.json(result, { status: 200 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e?.message === "NOT_FOUND" || e?.code === "P2025") {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    console.error(e);
    return NextResponse.json(
      { error: "Failed to delete Course" },
      { status: 500 },
    );
  }
}
