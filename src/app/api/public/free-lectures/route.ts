import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const lectures = await prisma.freeLecture.findMany({
      include: {
        classType: true,
        instructor: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        lectureDate: "asc",
      },
    });

    return NextResponse.json(lectures);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch free lectures" },
      { status: 500 }
    );
  }
}