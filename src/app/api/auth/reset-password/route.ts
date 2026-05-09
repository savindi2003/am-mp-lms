import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { token, password } = parsed.data;
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  // Find user by stored token + not expired
  const user = await prisma.user.findFirst({
    where: {
      resetTokenHash: tokenHash,
      resetTokenExpires: { gt: new Date() },
    },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Update password + clear token + kill sessions
  await prisma.user.update({
    where: { id: user.id },
    data: {
      hashedPassword,
      resetTokenHash: null,
      resetTokenExpires: null,
    },
  });

  return NextResponse.json({ ok: true });
}
