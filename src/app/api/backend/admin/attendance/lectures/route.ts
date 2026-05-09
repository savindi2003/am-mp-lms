import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const classId = Number(searchParams.get("classId"));
  const date = searchParams.get("date");

  if (!classId || !date) return Response.json([]);

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const lectures = await prisma.courseLectureLink.findMany({
    where: {
      classId,
      lectureDate: {
        gte: start,
        lte: end,
      },
    },
    select: {
      id: true,
      title: true,
    },
  });

  return Response.json(lectures);
}