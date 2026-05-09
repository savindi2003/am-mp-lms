import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/lib/db";
import { s3 } from "@/server/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export const runtime = "nodejs";

const BUCKET = process.env.S3_BUCKET!;

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ courseId: string; resourceId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = session.user.role;
  if (role !== "ADMIN" && role !== "INSTRUCTOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const courseId = Number((await params).courseId);
  const resourceId = (await params).resourceId;
  if (!Number.isFinite(courseId) || !resourceId) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  // find resource for this course
  const resource = await prisma.courseResource.findFirst({
    where: { id: resourceId, courseId },
    select: { id: true, s3Key: true },
  });
  if (!resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  // delete on S3 (ignore 404)
  try {
    await s3.send(
      new DeleteObjectCommand({ Bucket: BUCKET, Key: resource.s3Key }),
    );
  } catch {
    //  ignore S3 errors to avoid blocking DB cleanup
  }

  // remove DB row
  await prisma.courseResource.delete({ where: { id: resource.id } });

  return new NextResponse(null, { status: 204 });
}
