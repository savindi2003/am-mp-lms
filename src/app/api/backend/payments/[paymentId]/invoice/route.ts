// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/db";
// import { auth } from "@/app/auth";
// import PDFDocument from "pdfkit";

// export const runtime = "nodejs";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ paymentId: string }> }
// ) {
//   try {
//     const session = await auth();

//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     //  Next.js 16 params fix
//     const { paymentId } = await params;

//     const payment = await prisma.payment.findUnique({
//       where: {
//         id: Number(paymentId),
//       },
//       select: {
//         id: true,
//         amount: true,
//         month: true,
//         createdAt: true,

//         //  correct relation name
//         paymentClasses: {
//           select: {
//             class: {
//               select: {
//                 description: true,
//                 classType: {
//                   select: {
//                     name: true,
//                   },
//                 },
//               },
//             },

//             Enrollment: {
//               select: {
//                 enrollmentNumber: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!payment) {
//       return NextResponse.json(
//         { error: "Payment not found" },
//         { status: 404 }
//       );
//     }

//     //  get first payment class
//     const paymentClass = payment.paymentClasses[0];

//     const doc = new PDFDocument({
//       margin: 50,
//     });

//     const chunks: Buffer[] = [];

//     doc.on("data", (chunk) => {
//       chunks.push(chunk);
//     });

//     const pdfBuffer: Buffer = await new Promise((resolve) => {
//       doc.on("end", () => {
//         resolve(Buffer.concat(chunks));
//       });

      

//       doc.fontSize(22).text("Payment Invoice", {
//         align: "center",
//       });

//       doc.moveDown(2);

//       doc.fontSize(12);

//       doc.text(`Invoice ID: ${payment.id}`);
//       doc.moveDown();

//       doc.text(
//         `Class Type: ${
//           paymentClass?.class.classType.name ?? "-"
//         }`
//       );

//       doc.moveDown();

//       doc.text(
//         `Class: ${
//           paymentClass?.class.description ?? "-"
//         }`
//       );

//       doc.moveDown();

//       doc.text(
//         `Enrollment No: ${
//           paymentClass?.Enrollment?.enrollmentNumber ?? "-"
//         }`
//       );

//       doc.moveDown();

//       doc.text(`Month: ${payment.month}`);

//       doc.moveDown();

//       doc.text(`Paid Amount: Rs. ${payment.amount}`);

//       doc.moveDown();

//       doc.text(
//         `Paid Date: ${payment.createdAt.toLocaleDateString()}`
//       );

//       doc.moveDown(3);

//       doc.text("Thank you for your payment.", {
//         align: "center",
//       });

//       doc.end();
//     });

//     const uint8Array = new Uint8Array(pdfBuffer);

// return new NextResponse(uint8Array, {
//   headers: {
//     "Content-Type": "application/pdf",
//     "Content-Disposition": `inline; filename="invoice-${payment.id}.pdf"`,
//   },
// });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       { error: "Failed to generate invoice" },
//       { status: 500 }
//     );
//   }
// }

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
      where: {
        id: Number(paymentId),
      },
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
                  select: {
                    name: true,
                  },
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

    const paymentClass = payment.paymentClasses[0];

    const doc = new PDFDocument({
      size: "A4",
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

     

      const primary = "#2563eb";
      const dark = "#111827";
      const gray = "#6b7280";
      const light = "#f3f4f6";
      const success = "#16a34a";

      

      doc.rect(0, 0, doc.page.width, 130)
        .fill(primary);

      // LOGO CIRCLE
      doc.circle(80, 65, 28)
        .fill("#ffffff");

      doc
        .fillColor(primary)
        .fontSize(22)
        .font("Helvetica-Bold")
        .text("LMS", 62, 55);

      // COMPANY NAME
      doc
        .fillColor("#ffffff")
        .fontSize(28)
        .font("Helvetica-Bold")
        .text("Alpha LMS", 130, 40);

      doc
        .fontSize(12)
        .font("Helvetica")
        .text("Professional Learning Management System", 130, 75);

      

      doc.moveDown(4);

      doc
        .fillColor(dark)
        .fontSize(24)
        .font("Helvetica-Bold")
        .text("PAYMENT INVOICE", 50, 170);

      // STATUS BADGE
      doc
        .roundedRect(420, 170, 120, 30, 8)
        .fill(success);

      doc
        .fillColor("#ffffff")
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("PAID", 465, 179);

      

      doc.moveTo(50, 220)
        .lineTo(550, 220)
        .strokeColor("#d1d5db")
        .stroke();

      doc.fillColor(gray)
        .fontSize(11)
        .font("Helvetica");

      doc.text("Invoice ID", 50, 240);
      doc.text("Invoice Date", 300, 240);

      doc.fillColor(dark)
        .font("Helvetica-Bold");

      doc.text(`#INV-${payment.id}`, 50, 260);

      doc.text(
        payment.createdAt.toLocaleDateString(),
        300,
        260
      );

      

      doc.moveTo(50, 310)
        .lineTo(550, 310)
        .strokeColor("#d1d5db")
        .stroke();

      doc.fillColor(primary)
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Student Information", 50, 330);

      doc.fillColor(gray)
        .fontSize(11)
        .font("Helvetica");

      doc.text("Student Name", 50, 360);
      doc.text("Enrollment No", 300, 360);

      doc.fillColor(dark)
        .font("Helvetica-Bold");

      doc.text(
        `${paymentClass?.Enrollment?.student?.firstName ?? "-"} ${paymentClass?.Enrollment?.student?.lastName ?? "-"}`,
        50,
        380
      );

      doc.text(
        paymentClass?.Enrollment?.enrollmentNumber ?? "-",
        300,
        380
      );

      

      const tableTop = 450;

      // TABLE HEADER
      doc
        .roundedRect(50, tableTop, 500, 35, 5)
        .fill(primary);

      doc.fillColor("#ffffff")
        .fontSize(11)
        .font("Helvetica-Bold");

      doc.text("Class Type", 70, tableTop + 12);
      doc.text("Class", 200, tableTop + 12);
      doc.text("Month", 380, tableTop + 12);
      doc.text("Amount", 470, tableTop + 12);

      // TABLE ROW
      doc
        .roundedRect(50, tableTop + 35, 500, 55, 5)
        .fill(light);

      doc.fillColor(dark)
        .fontSize(10)
        .font("Helvetica");

      doc.text(
        paymentClass?.class.classType.name ?? "-",
        70,
        tableTop + 55,
        {
          width: 100,
        }
      );

      doc.text(
        paymentClass?.class.description ?? "-",
        200,
        tableTop + 55,
        {
          width: 150,
        }
      );

      doc.text(
        payment.month,
        390,
        tableTop + 55
      );

      doc.font("Helvetica-Bold")
        .text(
          `Rs. ${payment.amount.toFixed(2)}`,
          460,
          tableTop + 55
        );

      

      doc.moveTo(350, 590)
        .lineTo(550, 590)
        .strokeColor("#d1d5db")
        .stroke();

      doc.fillColor(gray)
        .fontSize(12)
        .font("Helvetica");

      doc.text("Total Paid", 380, 610);

      doc.fillColor(primary)
        .fontSize(20)
        .font("Helvetica-Bold")
        .text(
          `Rs. ${payment.amount.toFixed(2)}`,
          430,
          605
        );

      

      doc.moveTo(50, 700)
        .lineTo(550, 700)
        .strokeColor("#d1d5db")
        .stroke();

      doc.fillColor(gray)
        .fontSize(10)
        .font("Helvetica")
        .text(
          "Thank you for your payment and continued learning Science with Milan Pitagaldeniya.",
          50,
          720,
          {
            align: "center",
            width: 500,
          }
        );

      doc.text(
        "This is a system generated invoice.",
        50,
        740,
        {
          align: "center",
          width: 500,
        }
      );

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