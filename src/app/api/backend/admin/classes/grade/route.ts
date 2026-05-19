import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const classTypeId = searchParams.get("classTypeId");

  const classes = await prisma.class.findMany({
    where: {
      ...(classTypeId
        ? { classTypeId: Number(classTypeId) }
        : {}),
    },

    include: {
      classType: true,
      instructor: true,
    },

    orderBy: {
      id: "desc",
    },
  });

  return NextResponse.json(
    classes.map((c) => ({
      id: c.id,
      description: c.description,
      classFee: c.classFee,

      // FIX
      classType: {
        id: c.classType.id,
        name: c.classType.name,
      },

      instructor: `${c.instructor.firstName} ${c.instructor.lastName}`,
    }))
  );
}