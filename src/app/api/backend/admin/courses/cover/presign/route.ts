import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { s3 } from "@/server/s3"; // ✅ reuse your existing client
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET = process.env.S3_BUCKET!; // ✅ same var you already use elsewhere

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (session?.user.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { contentType } = await req.json(); // ✅ mirror your working route shape
    if (!contentType || !contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 },
      );
    }

    // No courseId yet → keep a flat covers path
    const ext = contentType.split("/")[1] ?? "jpg";
    const key = `courses/covers/${crypto.randomUUID()}.${ext}`;

    const cmd = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
      ServerSideEncryption: "AES256", // ✅ many buckets require SSE
    });

    const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 60 }); // keep short, like your user route

    // Return required headers the client MUST include on PUT
    const requiredHeaders = {
      "Content-Type": contentType,
      "x-amz-server-side-encryption": "AES256",
    };

    return NextResponse.json({ uploadUrl, key, requiredHeaders });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("cover presign error:", msg);
    return NextResponse.json(
      { error: "Failed to get upload URL" },
      { status: 500 },
    );
  }
}
