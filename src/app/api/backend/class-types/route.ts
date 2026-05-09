import { prisma } from "@/lib/db";

export async function GET() {
  const data = await prisma.classType.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: { id: "asc" },
  });

  return Response.json(data);
}