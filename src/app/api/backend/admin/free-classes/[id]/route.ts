import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";

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

          fromTime: new Date(
            body.fromTime
          ),

          toTime: new Date(
            body.toTime
          ),

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