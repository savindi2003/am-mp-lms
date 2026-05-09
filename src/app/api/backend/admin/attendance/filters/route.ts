import { prisma } from "@/lib/db";

export async function GET() {
  const classTypes = await prisma.classType.findMany();

  const classes = await prisma.class.findMany({
    include: { classType: true },
  });

  const lectures = await prisma.courseLectureLink.findMany();

  return Response.json({
    classTypes,
    classes,
    lectures,
  });
}