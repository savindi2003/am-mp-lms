import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ enrollmentId: string }> },
) {
  try {
    const enrollmentId = parseInt((await params).enrollmentId, 10);

    if (!Number.isFinite(enrollmentId) || enrollmentId <= 0) {
      return NextResponse.json(
        { error: "Invalid enrollmentId" },
        { status: 400 },
      );
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        id: enrollmentId,
      },

      select: {
        id: true,
        enrollmentNumber: true,

        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,

            user: {
              select: {
                NIC: true,
                email: true,
              },
            },
          },
        },

        class: {
          select: {
            id: true,
            month: true,
            description: true,

            classType: {
              select: {
                id: true,
                name: true,
              },
            },

            instructor: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },

        Attendance: {
          orderBy: {
            lecture: {
              lectureDate: "desc",
            },
          },

          select: {
            id: true,
            present: true,
            markedAt: true,

            markedBy: {
              select: {
                id: true,
                admin: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },

                instructor: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },

            lecture: {
              select: {
                id: true,
                title: true,
                lectureDate: true,
                fromTime: true,
                toTime: true,
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(enrollment, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to load attendance" },
      { status: 500 },
    );
  }
}
