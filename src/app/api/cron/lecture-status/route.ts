import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const now = new Date();

    // 1. Mark COMPLETED
    const completed = await prisma.courseLectureLink.updateMany({
      where: {
        status: {
          not: "COMPLETED",
        },
        toTime: {
          lt: now,
        },
      },
      data: {
        status: "COMPLETED",
      },
    });

    // 2. Mark LIVE (optional but recommended)
    const live = await prisma.courseLectureLink.updateMany({
      where: {
        status: {
          not: "COMPLETED",
        },
        fromTime: {
          lte: now,
        },
        toTime: {
          gte: now,
        },
      },
      data: {
        status: "LIVE",
      },
    });

    // 3. Mark UPCOMING
    const upcoming = await prisma.courseLectureLink.updateMany({
      where: {
        status: {
          not: "COMPLETED",
        },
        fromTime: {
          gt: now,
        },
      },
      data: {
        status: "SCHEDULED",
      },
    });

    return NextResponse.json({
      success: true,
      completed: completed.count,
      live: live.count,
      upcoming: upcoming.count,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}