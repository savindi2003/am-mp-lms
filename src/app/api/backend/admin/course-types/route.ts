import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, createReq } = await req.json();

    const clean = (name ?? "").toString().trim();
    if (createReq && clean) {
      const exists = await prisma.courseType.findUnique({
        where: { name: clean },
        select: { id: true },
      });
      if (exists?.id) {
        return NextResponse.json(
          { error: "This course name already exists" },
          { status: 409 },
        );
      }
    }
    if (createReq === undefined && clean) {
      //define update course name validator logic
    }

    if (!clean)
      return NextResponse.json({ error: "name is required" }, { status: 400 });

    // create or return existing by name
    const row = await prisma.courseType.upsert({
      where: { name: clean },
      update: {},
      create: { name: clean },
      select: { id: true, name: true },
    });

    return NextResponse.json(row, { status: 201 });
  } catch (e) {
    console.error(e);
    // handle unique error just in case
    return NextResponse.json(
      { error: "Failed to create course type" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (session?.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const types = await prisma.courseType.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(types, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch course types" },
      { status: 500 },
    );
  }
}
