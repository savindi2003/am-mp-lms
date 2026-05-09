import { NextResponse } from "next/server";
import { getCourses } from "@/modules/courses/data/action";

export async function GET() {
  try {
    const courses = await getCourses();

    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 },
    );
  }
}
