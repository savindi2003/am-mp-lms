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

    const { paymentId } = await params;

    const payment = await prisma.payment.findUnique({
      where: { id: Number(paymentId) },
      select: {
        id: true,
        amount: true,
        month: true,
        createdAt: true,

        paymentClasses: {
          select: {
            class: {
              select: {
                description: true,
                classType: {
                  select: { name: true },
                },
              },
            },
            Enrollment: {
              select: {
                enrollmentNumber: true,
                student: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
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

    const data = payment.paymentClasses[0];

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));


      doc
        .moveTo(50, 50)
        .lineTo(550, 50)
        .stroke();

      doc
        .font("Helvetica-Bold")
        .fontSize(20)
        .text("Science with Milan", 50, 70);

      doc
        .font("Helvetica")
        .fontSize(10)
        .text("Learning Management System", 50, 95);

      doc
        .font("Helvetica-Bold")
        .fontSize(22)
        .text("INVOICE", 420, 70);

      doc
        .font("Helvetica")
        .fontSize(10)
        .text(`No: INV-${payment.id}`, 420, 100);

      doc
        .moveTo(50, 120)
        .lineTo(550, 120)
        .stroke();

      
      // STUDENT INFO
      

      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .text("Student Information", 50, 150);



      doc.font("Helvetica").fontSize(10);

      doc.text(
        `Name: ${data?.Enrollment?.student?.firstName ?? "-"
        } ${data?.Enrollment?.student?.lastName ?? "-"}`,
        50,
        190
      );

      doc.text(
        `Enrollment No: ${data?.Enrollment?.enrollmentNumber ?? "-"
        }`,
        50,
        210
      );

      doc.text(`Month: ${payment.month}`, 300, 190);

      doc.text(
        `Date: ${payment.createdAt.toLocaleDateString()}`,
        300,
        210
      );



      

      const tableTop = 270;

      doc.font("Helvetica-Bold").fontSize(10);

      doc.text("Class Type", 50, tableTop);
      doc.text("Class", 180, tableTop);
      doc.text("Month", 360, tableTop);
      doc.text("Amount", 450, tableTop);

      doc
        .moveTo(50, tableTop + 15)
        .lineTo(550, tableTop + 15)
        .stroke();

      doc.font("Helvetica").fontSize(10);

      doc.text(
        data?.class.classType.name ?? "-",
        50,
        tableTop + 30
      );

      doc.text(
        data?.class.description ?? "-",
        180,
        tableTop + 30
      );

      doc.text(payment.month, 360, tableTop + 30);

      doc
        .font("Helvetica-Bold")
        .text(
          `Rs. ${payment.amount.toFixed(2)}`,
          450,
          tableTop + 30
        );

      doc
        .moveTo(50, tableTop + 50)
        .lineTo(550, tableTop + 50)
        .stroke();


      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .text("TOTAL", 380, 550);

      doc
        .fontSize(14)
        .text(`Rs. ${payment.amount.toFixed(2)}`, 450, 545);

      doc
        .moveTo(380, 570)
        .lineTo(550, 570)
        .stroke();



      doc
        .font("Helvetica")
        .fontSize(10)
        .text(
          "This is a system generated invoice. No signature required.",
          50,
          650,
          {
            align: "center",
            width: 500,
          }
        );

      doc.text(
        "Thank you for learning Science with Milan",
        50,
        670,
        {
          align: "center",
          width: 500,
        }
      );

      doc.end();
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
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