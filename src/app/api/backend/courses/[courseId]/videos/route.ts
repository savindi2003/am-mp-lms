import { NextResponse } from "next/server";
import { getCourseVideosInitial } from "@/modules/courses/[courseId]/data/action";

type Context = {
  params: Promise<{
    courseId: string;
  }>;
};

export async function GET(
  _req: Request,
  context: Context
) {
  const { courseId } = await context.params;

  const videos = await getCourseVideosInitial(Number(courseId));

  return NextResponse.json(videos);
}