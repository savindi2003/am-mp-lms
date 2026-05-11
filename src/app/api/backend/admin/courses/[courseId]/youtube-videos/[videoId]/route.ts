import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/app/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string; videoId: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role;

  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { videoId: id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await prisma.courseYoutubeVideo.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    console.error("Failed to delete link:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}