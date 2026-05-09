import StudentCourseVideos from "@/modules/courses/[courseId]/components/StudentCourseVideos";
import CourseResourceManager from "@/modules/shared/components/CourseResourceManager";
import StudentCourseResourceManager from "@/modules/shared/components/StudentCourseResourceManager";
import {
  getCourseById,
  getCourseVideosInitial,
  getEnrollmentByStudentId,
  getStudentAttendance
} from "@/modules/courses/[courseId]/data/action";
import { auth } from "@/app/auth";
import Empty from "@/modules/shared/components/Empty";
import { redirect } from "next/navigation";
import StudentAboutCourseModal from "@/modules/courses/[courseId]/components/StudentAboutCourseModal";
import { CourseAbout } from "@/modules/courses/[courseId]/types/typeCourseAbout";
import StudentLectureList from "@/modules/courses/[courseId]/components/StudentLectureLink";
import StudentLectureLinks from "@/modules/courses/[courseId]/components/StudentLectureLink";
import { Button } from "@/modules/ui/button";
import Link from "next/link";
import { useGetStudentByEnrollment } from "@/modules/shared/attendances/hooks/useGetStudentByEnrollment";


export default async function CourseVideosPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const cId = Number(courseId);
  const session = await auth();
  const course = await getCourseById(cId);
  const initial = await getCourseVideosInitial(cId);



  let isStudentEnrolled: boolean | null = null;
  if (session?.user.role !== "STUDENT") return redirect("/login");
  const enrollment = await getEnrollmentByStudentId(
    Number(session?.user.id),
    cId,
  );

  isStudentEnrolled = Boolean(enrollment?.id);
  const isStatusActive = enrollment?.enrollmentStatus === "ACTIVE";
  if (!course) return <Empty resourceName="Course" />;
  // const photoSrc = course.photo?.startsWith("courses/")
  //   ? `/api/storage/object?key=${encodeURIComponent(course.photo)}`
  //   : course.photo;

  // const instructorPhoto = course.instructor?.user?.photo ?? null;
  // const instructorName =
  //   `${course.instructor?.firstName ?? ""} ${course.instructor?.lastName ?? ""}`.trim();
  // const instructorTitle = course.instructor?.title ?? "";
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

  return (
    <main className="min-h-screen bg-white">
      
      <section className="border-b bg-gradient-to-r from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">

          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 bg-gray-100 px-4 sm:px-6 py-8 md:py-10">

            
            <div className="space-y-4">

              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                  Student Class Portal
                </p>

                <p className="text-2xl sm:text-sm font-bold text-slate-800 mt-4">
                  {course.classType?.name}
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
                  {course.description}
                </h1>
              </div>

              
              {enrollment && (
                <div className="flex flex-wrap items-center gap-3">

                  
                  <div className="bg-white border border-slate-200 shadow-sm px-4 py-3  min-w-[180px]">
                    <p className="text-xs text-slate-500 mb-1">
                      Enrollment Number
                    </p>

                    <p className="font-semibold text-slate-800">
                      #{enrollment.enrollmentNumber}
                    </p>
                  </div>

                  
                  <div className="bg-white border border-slate-200 shadow-sm px-4 py-3  min-w-[160px]">
                    <p className="text-xs text-slate-500 mb-1">
                      Active Month
                    </p>

                    <p className="font-semibold text-emerald-700">
                      {enrollment.activeMonth}
                    </p>
                  </div>

                  
                  <div className="bg-emerald-50 border border-emerald-200 px-4 py-3 ">
                    <p className="text-xs text-emerald-600 mb-1">
                      Enrollment Status
                    </p>

                    <p className="font-semibold text-emerald-700">
                      {enrollment.enrollmentStatus}
                    </p>
                  </div>

                </div>
              )}
            </div>

            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

             
              {aboutCourse?.instructor &&
                aboutCourse?.courseType &&
                aboutCourse?.description &&
                aboutCourse?.photo && (
                  <div>
                    <StudentAboutCourseModal course={aboutCourse} />
                  </div>
                )}

              
              <Link
                href={`/student/classes/${enrollment.id}/attendance?enrollmentId=${enrollment.id}`}
              >
                <Button
                  className="
              h-11 px-5
              bg-slate-800 hover:bg-slate-900
              text-white shadow-sm
            "
                >
                  Attendance
                </Button>
              </Link>

              
              <Link
                href={`/student/classes/${enrollment.id}/payments?enrollmentId=${enrollment.id}`}
              >
                <Button
                  variant="outline"
                  className="
              h-11 px-5 
              border-slate-300 hover:bg-slate-100
            "
                >
                  Payments
                </Button>
              </Link>

            </div>
          </div>
        </div>
      </section>

      
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-10">
        <div className="space-y-8">

          
          <section id="links"
            aria-labelledby="lecture-link-heading"
            className=" bg-white p-6">

            <h2
              id="attendance-heading"
              className="text-lg sm:text-xl font-semibold text-slate-800"
            >
              Active Time Table
            </h2>

            <StudentLectureLinks courseId={cId} />

          </section>


          
          <section
            id="resources"
            aria-labelledby="resources-heading"
            className="p-6"
          >
            <h2
              id="resources-heading"
              className="text-lg sm:text-xl font-semibold text-slate-800"
            >
              Course Resources
            </h2>
            <div className="mt-4">
              {isStatusActive ? (

                <StudentCourseResourceManager
                  courseId={cId}
                  userRole={session.user.role}
                  isStudentEnrolled={Boolean(enrollment?.id)}
                />

              ) : (
                <div className="text-slate-500">
                  You have no permission to access this resource.
                </div>
              )}
            </div>
          </section>

          
          <section
            id="videos"
            aria-labelledby="videos-heading"
            className="bg-white p-6"
          >
            <h2
              id="videos-heading"
              className="text-lg sm:text-xl font-semibold text-slate-800"
            >
              Course Videos
            </h2>
            <div className="mt-4">
              {isStatusActive ? (
                <StudentCourseVideos courseId={cId} />
              ) : (
                <div className="text-slate-500">
                  You have no permission to access this resource.
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
