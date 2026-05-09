import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const classTypeId = Number(searchParams.get("classTypeId"));

  if (!classTypeId) {
    return Response.json([]);
  }

  const classes = await prisma.class.findMany({
    where: { classTypeId },
    select: {
      id: true,
      description: true,
    },
  });

  return Response.json(classes);
}