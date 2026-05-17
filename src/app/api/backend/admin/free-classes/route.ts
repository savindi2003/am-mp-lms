import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fromZonedTime } from "date-fns-tz";

const TIME_ZONE = "Asia/Colombo";

export async function GET() {
  try {
    const lectures =
      await prisma.freeLecture.findMany({
        include: {
          classType: true,
          instructor: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(lectures);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch lectures",
      },
      {
        status: 500,
      }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // combine date + time
    const fromLocal = `${body.lectureDate} ${body.fromTime}`;
    const toLocal = `${body.lectureDate} ${body.toTime}`;

    // convert to UTC (IMPORTANT)
    const fromUTC = fromZonedTime(fromLocal, TIME_ZONE);
    const toUTC = fromZonedTime(toLocal, TIME_ZONE);

    const lecture = await prisma.freeLecture.create({
      data: {
        title: body.title,
        description: body.description,
        meetingLink: body.meetingLink,

        lectureDate: new Date(body.lectureDate),

        fromTime: fromUTC,
        toTime: toUTC,

        classTypeId: Number(body.classTypeId),
        instructorId: Number(body.instructorId),
      },
    });

    return NextResponse.json(lecture);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create lecture" },
      { status: 500 }
    );
  }
}