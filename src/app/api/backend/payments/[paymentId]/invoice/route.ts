import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/app/auth";
import PDFDocument from "pdfkit";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Next.js 16 params fix
    const { paymentId } = await params;

    const payment = await prisma.payment.findUnique({
      where: {
        id: Number(paymentId),
      },
      select: {
        id: true,
        amount: true,
        month: true,
        createdAt: true,

        // ✅ correct relation name
        paymentClasses: {
          select: {
            class: {
              select: {
                description: true,
                classType: {
                  select: {
                    name: true,
                  },
                },
              },
            },

            Enrollment: {
              select: {
                enrollmentNumber: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    // ✅ get first payment class
    const paymentClass = payment.paymentClasses[0];

    const doc = new PDFDocument({
      margin: 50,
    });

    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => {
      chunks.push(chunk);
    });

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      // =========================
      // PDF CONTENT
      // =========================

      doc.fontSize(22).text("Payment Invoice", {
        align: "center",
      });

      doc.moveDown(2);

      doc.fontSize(12);

      doc.text(`Invoice ID: ${payment.id}`);
      doc.moveDown();

      doc.text(
        `Class Type: ${
          paymentClass?.class.classType.name ?? "-"
        }`
      );

      doc.moveDown();

      doc.text(
        `Class: ${
          paymentClass?.class.description ?? "-"
        }`
      );

      doc.moveDown();

      doc.text(
        `Enrollment No: ${
          paymentClass?.Enrollment?.enrollmentNumber ?? "-"
        }`
      );

      doc.moveDown();

      doc.text(`Month: ${payment.month}`);

      doc.moveDown();

      doc.text(`Paid Amount: Rs. ${payment.amount}`);

      doc.moveDown();

      doc.text(
        `Paid Date: ${payment.createdAt.toLocaleDateString()}`
      );

      doc.moveDown(3);

      doc.text("Thank you for your payment.", {
        align: "center",
      });

      doc.end();
    });

    const uint8Array = new Uint8Array(pdfBuffer);

return new NextResponse(uint8Array, {
  headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": `inline; filename="invoice-${payment.id}.pdf"`,
  },
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}