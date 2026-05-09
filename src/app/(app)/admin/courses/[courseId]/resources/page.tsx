import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { YoutubeManager } from "@/modules/admin/youtube-videos/components/YoutubeManager";
import CourseResourceManager from "@/modules/shared/components/CourseResourceManager";
import { LectureManager } from "@/modules/admin/lecture-links/components/LectureManager";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminCourseVideosPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const courseId = Number((await params).courseId);

  // Get class data
  const course = await prisma.class.findUnique({
    where: {
      id: courseId,
    },
    select: {
      meetingLink: true,
    },
  });

  return (
    <section className="container flex flex-col gap-20">
      <div>
        <h1 className="mb-4 text-2xl font-semibold">
          Manage Lecture Session
        </h1>

        <LectureManager
          courseId={courseId}
          meetingLink={course?.meetingLink}
        />
      </div>

      <div>
        <h1 className="mb-4 text-3xl text-slate-800 font-semibold">
          Manage Resources
        </h1>

        <CourseResourceManager
          courseId={courseId}
          userRole={session.user.role}
        />
      </div>

      <div>
        <h1 className="mb-4 text-2xl font-semibold">
          Manage Videos
        </h1>

        <YoutubeManager courseId={courseId} />
      </div>
    </section>
  );
}