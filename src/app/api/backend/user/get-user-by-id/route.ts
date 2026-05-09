import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idStr = searchParams.get("id");

    if (!idStr || !/^\d+$/.test(idStr)) {
      return NextResponse.json(
        { error: "id (positive integer) is required" },
        { status: 400 },
      );
    }

    const id = parseInt(idStr, 10);

    const user = await prisma.user.findUnique({
      where: { id },
      // Never expose hashedPassword
      select: {
        id: true,
        email: true,
        NIC: true,
        role: true,
        createdAt: true,
        student: { select: { firstName: true, lastName: true } },
        instructor: { select: { firstName: true, lastName: true } },
        admin: { select: { firstName: true, lastName: true } },
      },
    });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error("GET /get-user-by-id error:", err);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
