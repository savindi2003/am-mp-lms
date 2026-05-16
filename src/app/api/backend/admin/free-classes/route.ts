
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";

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

export async function POST(
  req: NextRequest
) {
  try {
    const body = await req.json();

    const lecture =
      await prisma.freeLecture.create({
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
        error: "Failed to create lecture",
      },
      {
        status: 500,
      }
    );
  }
}