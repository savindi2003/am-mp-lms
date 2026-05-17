import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { fromZonedTime } from "date-fns-tz";

const TIME_ZONE = "Asia/Colombo";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
  req: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const fromLocal = `${body.lectureDate} ${body.fromTime}`;
        const toLocal = `${body.lectureDate} ${body.toTime}`;
    
        // convert to UTC (IMPORTANT)
        const fromUTC = fromZonedTime(fromLocal, TIME_ZONE);
        const toUTC = fromZonedTime(toLocal, TIME_ZONE);

    const lecture =
      await prisma.freeLecture.update({
        where: {
          id: Number(id),
        },

        data: {
          title: body.title,

          description:
            body.description,

          meetingLink:
            body.meetingLink,

          lectureDate: new Date(
            body.lectureDate
          ),

          fromTime: fromUTC,
        toTime: toUTC,

          classTypeId: Number(
            body.classTypeId
          ),

          instructorId: Number(
            body.instructorId
          ),
        },
      });

    return NextResponse.json(
      lecture
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to update lecture",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;

    await prisma.freeLecture.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to delete lecture",
      },
      {
        status: 500,
      }
    );
  }
}