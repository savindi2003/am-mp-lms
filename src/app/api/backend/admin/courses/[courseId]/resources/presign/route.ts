import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { s3 } from "@/server/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET = process.env.S3_BUCKET!;

// allow-list: images + pdf + common office files + zip
const ALLOWED_EXACT = new Set([
  "application/pdf",
  "application/zip",
  "application/msword",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
]);
const IMAGE_PREFIX = "image/";

function isAllowed(contentType: string) {
  return contentType.startsWith(IMAGE_PREFIX) || ALLOWED_EXACT.has(contentType);
}

function guessExt(contentType: string, fileName?: string | null) {
  if (fileName && fileName.includes(".")) {
    return fileName.split(".").pop() || "bin";
  }
  if (contentType.startsWith(IMAGE_PREFIX))
    return contentType.split("/")[1] ?? "img";
  switch (contentType) {
    case "application/pdf":
      return "pdf";
    case "application/zip":
      return "zip";
    case "application/msword":
      return "doc";
    case "application/vnd.ms-excel":
      return "xls";
    case "application/vnd.ms-powerpoint":
      return "ppt";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "docx";
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return "xlsx";
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return "pptx";
    default:
      return "bin";
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // allow ADMIN and INSTRUCTOR (keep simple)
  const role = session.user.role;
  if (role !== "ADMIN" && role !== "INSTRUCTOR")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const courseId = Number((await params).courseId);
  if (!Number.isFinite(courseId))
    return NextResponse.json({ error: "Invalid course id" }, { status: 400 });

  const { contentType, fileName } = await req.json().catch(() => ({}));
  if (typeof contentType !== "string" || !isAllowed(contentType)) {
    return NextResponse.json(
      { error: "Invalid content type" },
      { status: 400 },
    );
  }

  const ext = guessExt(contentType, fileName);
  const key = `courses/${courseId}/resources/${crypto.randomUUID()}.${ext}`;

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
  } as const;

  return NextResponse.json({ uploadUrl, key, requiredHeaders });
}
