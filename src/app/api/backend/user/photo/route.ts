import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { setUserPhotoKey } from "@/modules/profile/data/action";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { key } = await req.json();
  if (typeof key !== "string" || !key.startsWith("users/")) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  const userId = Number(session.user.id);
  const updated = await setUserPhotoKey(userId, key);
  return NextResponse.json(updated);
}
