import { NextResponse } from "next/server";
import {prisma} from "@/lib/db";

export async function GET() {
  try {
    const instructors = await prisma.instructor.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(instructors);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch instructors" },
      { status: 500 }
    );
  }
}