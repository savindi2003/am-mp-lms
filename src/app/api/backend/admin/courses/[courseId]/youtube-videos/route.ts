import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { title, description, link, month } = (await req.json().catch(() => ({}))) as {
    title?: string;
    description?: string;
    link?: string;
    month?: string;
  };

  if (!title)
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  if (!link)
    return NextResponse.json({ error: "Link is required" }, { status: 400 });

  const { classId, id: videoId } = await prisma.courseYoutubeVideo.create({
    data: {
      classId: Number((await params).courseId),
      title,
      description,
      link,
      uploadedByUserId: Number(session.user.id),
      visibility: "PUBLISHED",
      month,
    },
    select: { classId: true, id: true },
  });

  const resultEnrollmentIds = await prisma.enrollment.findMany({
    where: { classId: Number((await params).courseId) },
    select: { id: true },
  });

  const isAccessed = true;
  resultEnrollmentIds.forEach(({ id: enrollmentId }: { id: number }) => {
    (async () => {
      await prisma.videoAccessControl.create({
        data: { enrollmentId, videoId, isAccessed },
      });
    })();
  });
  return NextResponse.json({ ok: true });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = session.user.role;
  if (role !== "ADMIN" && role !== "INSTRUCTOR")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rows = await prisma.courseYoutubeVideo.findMany({
    where: { classId: Number((await params).courseId) },
    orderBy: [{ orderIndex: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      title: true,
      description: true,
      link: true,
      visibility: true,
      createdAt: true,
      class: {
        include: {
          enrollments: true,
        },
      },
      month: true,
    },
  });
  return NextResponse.json(
    rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
  );
}
