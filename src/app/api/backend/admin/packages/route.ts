import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const classTypeId = Number(searchParams.get("classTypeId"));

  const packages = await prisma.classPackage.findMany({
    include: {
      items: {
        include: {
          class: true,
        },
      },
    },
  });

  return NextResponse.json(packages);
}