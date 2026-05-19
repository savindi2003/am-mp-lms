import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const packages = await prisma.classPackage.findMany({
    include: {
      items: {
        include: {
          class: {
            include: {
              classType: true,
            },
          },
        },
      },
    },

    orderBy: {
      id: "desc",
    },
  });

  return NextResponse.json(packages);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const created = await prisma.classPackage.create({
      data: {
        name: body.name,
        totalFee: Number(body.totalFee),

        items: {
          create: body.classIds.map((id: number) => ({
            classId: id,
          })),
        },
      },
    });

    return NextResponse.json(created);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to create package" },
      { status: 500 }
    );
  }
}