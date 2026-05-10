import { NextResponse } from "next/server";
import { getCourseVideosInitial } from "@/modules/courses/[courseId]/data/action";

type Context = {
  params: {
    courseId: string;
  };
};

export async function GET(
  _req: Request,
  context: Context
) {
  const courseId = Number(context.params.courseId);

  const videos = await getCourseVideosInitial(courseId);

  return NextResponse.json(videos);
}