import { prisma } from "@/lib/db";

export async function GET() {
  const data = await prisma.classType.findMany({
    orderBy: { createdAt: "asc" },
  });

  return Response.json(data);
}