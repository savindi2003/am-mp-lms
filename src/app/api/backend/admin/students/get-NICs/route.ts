import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const students = await prisma.student.findMany({
    include: { user: true },
  });

  return NextResponse.json(
    students.map((s) => ({
      id: s.id,
      NIC: s.user.NIC,
      name: `${s.firstName} ${s.lastName}`,
    }))
  );
}