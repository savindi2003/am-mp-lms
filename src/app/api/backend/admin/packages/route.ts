import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const classTypeId = Number(searchParams.get("classTypeId"));

  const packages = await prisma.classPackage.findMany({
  where: {
    items: {
      some: {
        class: {
          classTypeId: classTypeId,
        },
      },
    },
  },
  include: {
    items: {
      where: {
        class: {
          classTypeId: classTypeId,
        },
      },
      include: {
        class: {
          include: {
            classType: true,
          },
        },
      },
    },
  },
});

  return NextResponse.json(packages);
}