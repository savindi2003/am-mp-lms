import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { syncEnrollmentToGoogle } from "@/services/enrollment-google-sync";

export async function POST(req: Request) {
  const session = await auth();
  const body = await req.json();

  const {
    enrollmentId,
    studentId,
    classId,
    month,
    reason,
  } = body;

  const existing = await prisma.enrollmentMonthAccess.findUnique({
    where: {
      enrollmentId_month: {
        enrollmentId,
        month,
      },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Already exists" },
      { status: 400 }
    );
  }

  const data = await prisma.enrollmentMonthAccess.create({
    data: {
      enrollmentId,
      studentId,
      classId,
      month,
      status: "OVERRIDDEN",
      reason,
      grantedByAdminId: Number(session?.user.id)
    },
  });

  await syncEnrollmentToGoogle(enrollmentId, month);

  return NextResponse.json(data);
}

// UPDATE STATUS
// export async function PATCH(req: Request) {
//   const body = await req.json();

//   const { id, status } = body;

//   const updated = await prisma.enrollmentMonthAccess.update({
//     where: { id },
//     data: {
//       status,
//       revokedAt: status === "REVOKED" ? new Date() : null,
//     },
//   });

//   return NextResponse.json(updated);
// }

export async function PATCH(req: Request) {
  const body = await req.json();

  const id = Number(body.id);
  const status = body.status;

  if (!id || !status) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }

  const updated = await prisma.enrollmentMonthAccess.update({
    where: { id },
    data: {
      status,
      revokedAt: status === "REVOKED" ? new Date() : null,
    },
  });

  await syncEnrollmentToGoogle(
  updated.enrollmentId,
  updated.month
);

  return NextResponse.json(updated);
}

// GET TABLE DATA
export async function GET() {
  const data = await prisma.enrollmentMonthAccess.findMany({
    include: {
      student: {
        include :{
          user:true,
        }
      },
      class: {
        include:{
            classType:true,
        }
      },
      enrollment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(data);
}