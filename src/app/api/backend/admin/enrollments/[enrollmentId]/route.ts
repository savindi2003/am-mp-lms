import { NextResponse } from "next/server";
import { deleteAdminEnrollment } from "@/modules/admin/enrollments/data/actions";
import { updateEnrollmentStatusById } from "@/modules/shared/data/action";
import { EnrollmentStatus } from "@prisma/client";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ enrollmentId: string }> },
) {
  const id = Number((await params).enrollmentId);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await deleteAdminEnrollment(id);
    return new NextResponse(null, { status: 204 }); // no body
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 },
      );
    }
    console.error("Failed to delete enrollment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

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
    const status = body?.enrollmentStatus as string | undefined;
    if (!status) {
      return NextResponse.json(
        { error: "enrollmentStatus required" },
        { status: 400 },
      );
    }
    if (!Object.values(EnrollmentStatus).includes(status as EnrollmentStatus)) {
      return NextResponse.json(
        { error: "Invalid enrollmentStatus" },
        { status: 400 },
      );
    }

    await updateEnrollmentStatusById(id, status as EnrollmentStatus);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /enrollments/[id] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
