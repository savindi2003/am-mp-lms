import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/app/auth";

type Body = { visibility?: "PUBLISHED" | "HIDDEN" };

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; videoId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = session.user.role;
  if (role !== "ADMIN" && role !== "INSTRUCTOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { visibility } = (await req.json().catch(() => ({}))) as Body;
  if (visibility !== "PUBLISHED" && visibility !== "HIDDEN") {
    return NextResponse.json(
      { error: "visibility must be PUBLISHED or HIDDEN" },
      { status: 400 },
    );
  }

  try {
    const updated = await prisma.courseYoutubeVideo.update({
      where: { id: (await params).videoId },
      data: { visibility },
      select: { id: true, visibility: true },
    });
    return NextResponse.json(updated);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Not found" },
      { status: 404 },
    );
  }
}
