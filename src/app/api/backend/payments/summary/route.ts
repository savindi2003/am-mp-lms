// import { NextResponse } from "next/server";
// import { getPaymentsSummaryForCurrentUser } from "@/modules/payments/data/action";

// export async function GET() {
//   try {
//     const rows = await getPaymentsSummaryForCurrentUser();
//     return NextResponse.json(rows, { status: 200 });
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (err: any) {
//     if (String(err?.message || "").includes("Unauthorized")) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     console.error("GET /api/backend/enrollments/summary error:", err);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }
