import { NextResponse } from "next/server";
import { updateEnrollmentCourseDay } from "@/modules/shared/data/action";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ enrollmentId: string }> },
) {
  try {
    const id = Number((await params).enrollmentId);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await req.json();
    const courseDayId = body?.courseDayId;
    if (!courseDayId) {
      return NextResponse.json(
        { error: "Course day id required" },
        { status: 400 },
      );
    }

    await updateEnrollmentCourseDay(id, courseDayId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
