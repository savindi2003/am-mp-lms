import { NextResponse } from "next/server";
import { getCourseVideosInitial } from "@/modules/courses/[courseId]/data/action";

export async function GET(
  _req: Request,
  { params }: { params: { courseId: string } }
) {
  const courseId = Number(params.courseId);

  const videos = await getCourseVideosInitial(courseId);

  return NextResponse.json(videos);
}