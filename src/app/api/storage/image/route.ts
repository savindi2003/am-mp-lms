import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/server/s3";

const BUCKET = process.env.S3_BUCKET!;
const EXPIRES = 60;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  const signed = await getSignedUrl(s3, cmd, { expiresIn: EXPIRES });
  return NextResponse.redirect(signed, 302);
}
