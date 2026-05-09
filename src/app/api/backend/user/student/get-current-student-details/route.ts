import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { getCurrentUser } from "@/modules/shared/data/action";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = Number(session.user.id);

    const student = await getCurrentUser();
    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
