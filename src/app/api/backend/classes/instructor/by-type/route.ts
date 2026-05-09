import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const classTypeId = Number(searchParams.get("classTypeId"));
  const instructorId = Number(searchParams.get("instructorId"));

  const data = await prisma.class.findMany({
    where: { classTypeId ,  instructorId},
    select: {
      id: true,
      description: true,
      classFee: true,
      classType: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
  });

  return Response.json(data);
}