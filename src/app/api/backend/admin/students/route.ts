import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: true,
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to load students" },
      { status: 500 }
    );
  }
}

