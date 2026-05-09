import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { videoId, title, description, durationSeconds, thumbnailKey } =
    (await req.json()) as {
      videoId?: string;
      title?: string;
      description?: string;
      durationSeconds?: number;
      thumbnailKey?: string;
    };

  if (!videoId)
    return NextResponse.json({ error: "videoId required" }, { status: 400 });

  await prisma.courseVideo.update({
    where: { id: videoId },
    data: {
      status: "READY",
      title,
      description,
      durationSeconds,
      thumbnailKey,
    },
  });

  return NextResponse.json({ ok: true });
}
