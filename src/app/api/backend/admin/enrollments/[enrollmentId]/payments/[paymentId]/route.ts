// import { NextResponse } from "next/server";
// import { deleteAdminPayment } from "@/modules/admin/enrollments/payments/data/action";

// export async function DELETE(
//   req: Request,
//   { params }: { params: Promise<{ paymentId: string }> },
// ) {
//   const id = Number((await params).paymentId);
//   if (!id) {
//     return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
//   }

//   try {
//     await deleteAdminPayment(id);
//     return new NextResponse(null, { status: 204 }); // no body
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     if (error.code === "P2025") {
//       return NextResponse.json({ error: "Payment not found" }, { status: 404 });
//     }
//     console.error("Failed to delete payment:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 },
//     );
//   }
// }

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Payments route working" });
}