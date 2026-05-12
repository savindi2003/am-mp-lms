import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // Your prisma client instance
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // //  1. Validate with zod
    // const parsed = signupSchema.safeParse(body);
    // if (!parsed.success) {
    //   return NextResponse.json(
    //     { message: parsed.error.format() },
    //     { status: 400 },
    //   );
    // }

    const { email, firstName, lastName, password, NIC } = body;
    console.log(email, firstName, lastName, password, NIC);

    // 2. Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { NIC } });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 },
      );
    }

    //  3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  4. Create User + Student (for example)
    const user = await prisma.user.create({
      // data: {
      //   email,
      //   hashedPassword,
      //   Student: {
      //     create: {
      //       firstName,
      //       lastName,
      //       enrollmentNo: `ENR-${Date.now()}`,
      //     },
      //   },
      // },
      data: {
        email,
        hashedPassword,
        NIC,
        admin: {
          create: {
            firstName,
            lastName,
            // title: "Graphic Design",
          },
        },
      },
    });

    try {
  await sendWelcomeEmail(email, NIC, password);
  console.log("Welcome email sent");
} catch (mailError) {
  console.log("Email send error:", mailError);
}

    return NextResponse.json({ message: "Signup successful", userId: user.id });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Sign Error", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
