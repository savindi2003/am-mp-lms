import { NextResponse } from "next/server";
import  {getAdminPayments}  from "@/modules/admin/enrollments/payments/data/action";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ enrollmentId: string }> }
) {
  const { enrollmentId } = await params; // 

  const id = Number(enrollmentId);

  if (Number.isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid enrollment id" },
      { status: 400 }
    );
  }

  const data = await getAdminPayments(id);

  return NextResponse.json(data);
}
