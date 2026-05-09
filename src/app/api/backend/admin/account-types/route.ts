import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Role } from "@prisma/client";

export async function GET() {
  try {
    const rows = await prisma.user.findMany({
      select: { role: true },
      distinct: ["role"],
    });
    const roles = rows.map((r) => r.role).sort() as Role[];
    return NextResponse.json(roles, { status: 200 });
  } catch (e) {
    console.error("Failed to fetch user types:", e);
    return NextResponse.json(
      { error: "Failed to fetch user types" },
      { status: 500 },
    );
  }
}
