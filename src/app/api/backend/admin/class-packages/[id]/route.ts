import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: any
) {
  try {
   
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    const { totalFee } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    const updated = await prisma.classPackage.update({
      where: { id },
      data: {
        totalFee: Number(totalFee),
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: any
) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    await prisma.classPackageItem.deleteMany({
      where: { packageId: id },
    });

    const deleted = await prisma.classPackage.delete({
      where: { id },
    });

    return NextResponse.json(deleted);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to delete package" },
      { status: 500 }
    );
  }
}
