import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { createCourseResource } from "@/modules/admin/resources/data/action";
import { prisma } from "@/lib/db";

type Body = {
  key?: string;
  title?: string;
  contentType?: string;
  sizeBytes?: number;
  month: string;
};

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = session.user.role;
  if (role !== "ADMIN" && role !== "INSTRUCTOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const courseId = Number((await params).courseId);
  if (!Number.isFinite(courseId)) {
    return NextResponse.json({ error: "Invalid course id" }, { status: 400 });
  }

  const { key, title, contentType, sizeBytes, month } = (await req
    .json()
    .catch(() => ({}))) as Body;

  // basic validation
  if (
    typeof key !== "string" ||
    !key.startsWith(`courses/${courseId}/resources/`)
  ) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  // derive a simple default title if none provided
  const fallbackTitle = key.split("/").pop() || "resource";
  const finalTitle = (title ?? fallbackTitle).slice(0, 200);

  const classId = courseId;

  try {
    const created = await createCourseResource({
      classId,
      s3Key: key,
      title: finalTitle,
      contentType,
      sizeBytes,
      uploadedByUserId: Number(session.user.id),
      month
    });
    return NextResponse.json(created, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to save resource" },
      { status: 500 },
    );
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const classId = Number((await params).courseId);
  if (!Number.isFinite(classId))
    return NextResponse.json({ error: "Invalid course id" }, { status: 400 });

  const rows = await prisma.courseResource.findMany({
    where: { classId },
    select: {
      id: true,
      title: true,
      s3Key: true,
      contentType: true,
      sizeBytes: true,
      createdAt: true,
      uploadedBy: { select: { id: true, email: true } },
      month: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(rows);
}
