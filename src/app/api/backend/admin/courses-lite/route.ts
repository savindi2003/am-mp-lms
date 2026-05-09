import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { assertAdmin } from "@/modules/admin/utils/assertAdmin";

export async function GET() {
  try {
    await assertAdmin();
    const rows = await prisma.course.findMany({
      select: { id: true, totalSessions: true, currentWeek: true },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(rows);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    const msg = e?.message ?? "Server error";
    const code = msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: msg }, { status: code });
  }
}
