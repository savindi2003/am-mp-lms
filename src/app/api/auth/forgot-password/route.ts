import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateResetToken } from "@/lib/reset-token";
import { sendPasswordResetEmail } from "@/lib/email";
import { z } from "zod";
import { auth } from "@/app/auth";

const bodySchema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const session = await auth();
  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  const requestedEmail = parsed.data.email;

  let user = null;

  if (session?.user?.id) {
    // Logged-in flow: allow sending ONLY if it matches saved email
    const me = await prisma.user.findUnique({
      where: { id: Number(session.user.id) },
      select: { id: true, email: true },
    });
    if (!me) return NextResponse.json({ ok: true }); // no leak

    if (me.email !== requestedEmail) {
      return NextResponse.json(
        { error: "Email does not match your account" },
        { status: 400 },
      );
    }
    user = me;
  } else {
    // Anonymous flow: look up by email (do not reveal existence)
    const found = await prisma.user.findUnique({
      where: { email: requestedEmail },
      select: { id: true, email: true },
    });
    user = found ?? null;
  }

  // Always 200 to client, only proceed if user exists
  if (user) {
    const { token, tokenHash } = generateResetToken();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    // store on the user
    await prisma.user.update({
      where: { id: user.id },
      data: { resetTokenHash: tokenHash, resetTokenExpires: expires },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
    // We no longer need the email in the URL; token alone is enough
    const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;

    await sendPasswordResetEmail(user.email, resetUrl);
  }

  return NextResponse.json({ ok: true });
}
