import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/lib/db";
import { s3 } from "@/server/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET = process.env.S3_BUCKET!;

type Body = {
  filename: string;
  contentType: string; // use the browser's file.type
  sizeBytes: number;
  title?: string;
  description?: string;
};

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const courseId = Number((await params).courseId);
  const {
    filename,
    contentType,
    sizeBytes,
    title = "Untitled",
    description,
  } = (await req.json()) as Partial<Body>;

  if (
    !filename ||
    !contentType ||
    !contentType.startsWith("video/") ||
    !sizeBytes
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // derive extension from filename or contentType
  const extFromName = filename.includes(".")
    ? filename.split(".").pop()!
    : undefined;
  const ext = extFromName ?? contentType.split("/")[1] ?? "mp4";
  const key = `courses/${courseId}/videos/${crypto.randomUUID()}.${ext}`;

  // Placeholder DB row (status = UPLOADING)
  const video = await prisma.courseVideo.create({
    data: {
      courseId,
      title,
      description,
      s3Key: key,
      originalFilename: filename,
      mimeType: contentType,
      sizeBytes: BigInt(sizeBytes),
      uploadedByUserId: Number(session.user.id),
      status: "UPLOADING",
    },
    select: { id: true, s3Key: true },
  });

  // Same presign pattern as your photo route
  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
    ServerSideEncryption: "AES256",
  });
  const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 60 });

  const requiredHeaders = {
    "Content-Type": contentType,
    "x-amz-server-side-encryption": "AES256",
  };

  return NextResponse.json({
    uploadUrl,
    key,
    requiredHeaders,
    videoId: video.id,
  });
}
