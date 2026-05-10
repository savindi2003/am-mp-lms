import { prisma } from "@/lib/db";
import { auth } from "@/app/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: any) {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { classId } = params;
  const body = await req.json();

  console.log(body);

  const recording = await prisma.classRecodings.create({
    data: {
      title: body.title,
      link: body.link,
      month: body.month,
      classId: Number(classId),
      uploadedByUserId: Number(session.user.id),
    },
  });

  return NextResponse.json(recording);
}

export async function GET(req: Request, { params }: any) {
  const { classId } = params;

  const recordings = await prisma.classRecodings.findMany({
    where: { classId: Number(classId) },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(recordings);
}