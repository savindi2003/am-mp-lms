import { auth } from "@/app/auth";
import { notFound, redirect } from "next/navigation";
import InstructorYoutubeManager from "@/modules/instructor/youtube-videos/components/InstructorYoutubeManager";
import CourseResourceManager from "@/modules/shared/components/CourseResourceManager";
import InstructorLinkManage from "@/modules/instructor/lecture-links/components/InstructorLinkManager";
import InstructorRecordingsManager from "@/modules/instructor/recordings/components/InstructorRecordingsManager";


export default async function InstCourseVideosPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const courseId = Number((await params).courseId);
  if (session.user.role !== "INSTRUCTOR") return notFound();

  return (
    <section className="container flex flex-col gap-20">

      <div>

        <h1 className="mb-4 text-2xl font-semibold">Scheduled Lectures</h1>

        <InstructorLinkManage courseId={courseId} />



      </div>

      <div>
        <h1 className="mb-4 text-2xl font-semibold">Recordings</h1>

        <InstructorRecordingsManager courseId={courseId} />
      </div>

      <div>
        <h1 className="mb-4 text-2xl font-semibold">Manage Resources</h1>

        <CourseResourceManager
          courseId={courseId}
          userRole={session.user.role}
        />
      </div>
      <div>
        <h1 className="mb-4 text-2xl font-semibold">Manage Videos</h1>
        <InstructorYoutubeManager courseId={courseId} />
      </div>
    </section>
  );
}
