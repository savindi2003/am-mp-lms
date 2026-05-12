import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const instructorId = Number(searchParams.get("instructorId"));

    const now = new Date();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayStart.getDate() + 1);

    let lectures = await prisma.courseLectureLink.findMany({
      where: {
        class: {
          instructorId,
        },

        lectureDate: {
          gte: todayStart,
          lt: todayEnd,
        },

        // hide expired lectures
        toTime: {
          gte: now,
        },
      },

      orderBy: {
        fromTime: "asc",
      },

      take: 4,

      include: {
        class: {
          include: {
            classType: true,
          },
        },
      },
    });

    // if no remaining lectures today -> get upcoming
    if (lectures.length === 0) {
      lectures = await prisma.courseLectureLink.findMany({
        where: {
          class: {
            instructorId,
          },

          lectureDate: {
            gte: todayEnd,
          },

          // future ending time
          toTime: {
            gte: now,
          },
        },

        orderBy: [
          {
            lectureDate: "asc",
          },
          {
            fromTime: "asc",
          },
        ],

        take: 4,

        include: {
          class: {
            include: {
              classType: true,
            },
          },
        },
      });
    }

    return Response.json(lectures);
  } catch (err) {
    console.error(err);
    return new Response("Error", { status: 500 });
  }
}