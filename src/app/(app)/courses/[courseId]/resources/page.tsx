import StudentCourseVideos from "@/modules/courses/[courseId]/components/StudentCourseVideos";
import StudentCourseResourceManager from "@/modules/shared/components/StudentCourseResourceManager";
import {
  getCourseById,
  getEnrollmentByStudentId,
} from "@/modules/courses/[courseId]/data/action";
import { auth } from "@/app/auth";
import Empty from "@/modules/shared/components/Empty";
import { redirect } from "next/navigation";
import StudentAboutCourseModal from "@/modules/courses/[courseId]/components/StudentAboutCourseModal";
import { CourseAbout } from "@/modules/courses/[courseId]/types/typeCourseAbout";
import StudentLectureLinks from "@/modules/courses/[courseId]/components/StudentLectureLink";
import { Button } from "@/modules/ui/button";
import Link from "next/link";
import StudentRecordings from "@/modules/courses/[courseId]/components/StudentRecordings";

type PageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function CourseVideosPage({ params }: PageProps) {
  const { courseId } = await params;

  const cId = Number(courseId);

  const session = await auth();

  if (!session || session.user.role !== "STUDENT") {
    return redirect("/login");
  }

  const course = await getCourseById(cId);

  const enrollment = await getEnrollmentByStudentId(
    Number(session.user.id),
    cId
  );

  if (!course) return <Empty resourceName="Course" />;
  if (!enrollment) return <Empty resourceName="Enrollment" />;

  const isStatusActive = enrollment.enrollmentStatus === "ACTIVE";

  const aboutCourse: CourseAbout = {
    photo: course.photo ?? null,
    courseType: course.classType?.name,
    description: course.description ?? null,
    instructor: course.instructor
      ? {
        firstName: course.instructor.firstName,
        lastName: course.instructor.lastName,
        title: course.instructor.title,
        user: { photo: course.instructor.user?.photo ?? null },
      }
      : null,
  };

  const enrollmentId = enrollment.id;

  const statusStyles: any = {
    ACTIVE: "bg-green-100 text-green-700 border-green-300",
    DROPPED: "bg-red-100 text-red-700 border-red-300",
    COMPLETED: "bg-yellow-100 text-yellow-700 border-yellow-300",
  };

  return (
    <main className="min-h-screen bg-white">

      <section className="border-b bg-gradient-to-r from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">

          <div className="flex flex-col lg:flex-row justify-between gap-6 bg-gray-100 px-4 py-6">

            {/* LEFT */}
            <div className="space-y-3">

              <p className="text-lg sm:text-xl font-bold text-slate-800">
                {course.classType?.name}
              </p>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug">
                {course.description}
              </h1>

              {/* BADGES */}
              <div className="flex flex-wrap gap-2 sm:gap-3">

                <div className="bg-white px-3 py-2 text-xs sm:text-sm rounded shadow-sm">
                  #{enrollment.enrollmentNumber}
                </div>



                <div
                  className={`px-3 py-2 text-xs sm:text-sm rounded border shadow-sm ${statusStyles[enrollment.enrollmentStatus] ||
                    "bg-white text-slate-700 border-gray-200"
                    }`}
                >
                  {enrollment.enrollmentStatus}
                </div>

              </div>
            </div>

            {/* RIGHT BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">

              {aboutCourse && (
                <div className="w-full sm:w-auto">
                  <StudentAboutCourseModal course={aboutCourse} />
                </div>
              )}

              {/* Attendance */}
              <Link
                className="w-full sm:w-auto"
                href={`/student/classes/${enrollmentId}/attendance?enrollmentId=${enrollmentId}`}
              >
                <Button className="w-full sm:w-auto">
                  Attendance
                </Button>
              </Link>

              {/* Payments */}
              <Link
                className="w-full sm:w-auto"
                href={`/student/classes/${enrollmentId}/payments?enrollmentId=${enrollmentId}`}
              >
                <Button variant="outline" className="w-full sm:w-auto">
                  Payments
                </Button>
              </Link>

            </div>

          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-10">

        {/* LECTURES */}
        <section className="p-6 bg-white">
          <h2 className="text-lg font-semibold">Active Time Table</h2>

          {isStatusActive ? (
            <StudentLectureLinks courseId={cId} />
          ) : (
            <p className="text-slate-500">
              You have no permission to access live sessions.
            </p>
          )}

        </section>

        {/* RECORDINGS */}
        <section className="p-6 bg-white">
          <h2 className="text-lg font-semibold">
            Class Recordings
          </h2>

          {isStatusActive ? (
            <StudentRecordings courseId={cId} />
          ) : (
            <p className="text-slate-500">
              You have no permission to access recordings.
            </p>
          )}
        </section>

        {/* RESOURCES */}
        <section className="p-6">
          <h2 className="text-lg font-semibold">Course Resources</h2>

          {isStatusActive ? (
            <StudentCourseResourceManager
              courseId={cId}
              userRole={session.user.role}
              isStudentEnrolled={true}
            />
          ) : (
            <p className="text-slate-500">
              You have no permission to access this resource.
            </p>
          )}
        </section>

        {/* VIDEOS */}
        <section className="p-6 bg-white">
          <h2 className="text-lg font-semibold">Course Videos</h2>

          {isStatusActive ? (
            <StudentCourseVideos courseId={cId} />
          ) : (
            <p className="text-slate-500">
              You have no permission to access this resource.
            </p>
          )}
        </section>

      </section>
    </main>
  );
}