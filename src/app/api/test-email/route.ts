import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_HOST,
      port: Number(process.env.BREVO_PORT),
      secure: false,
      auth: {
        user: process.env.BREVO_LOGIN,
        pass: process.env.BREVO_SMTPKEY,
      },
    });

    const info = await transporter.sendMail({
      from: `LMS Support <${process.env.EMAIL_FROM}>`,
      to: "meriyandilhani917@gmail.com",
      subject: "Test Email",
      text: "Email working successfully",
    });

    console.log(info);

    return NextResponse.json({
      success: true,
      info,
    });
  } catch (error) {
    console.log("MAIL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error,
      },
      { status: 500 },
    );
  }
}