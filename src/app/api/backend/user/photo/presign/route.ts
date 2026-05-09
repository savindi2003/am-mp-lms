import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { s3 } from "@/server/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET = process.env.S3_BUCKET!;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { contentType } = await req.json();
  if (!contentType || !contentType.startsWith("image/")) {
    return NextResponse.json(
      { error: "Invalid content type" },
      { status: 400 },
    );
  }

  const userId = Number(session.user.id);
  const ext = contentType.split("/")[1] ?? "jpg";
  const key = `users/${userId}/${crypto.randomUUID()}.${ext}`;

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

  return NextResponse.json({ uploadUrl, key, requiredHeaders });
}
