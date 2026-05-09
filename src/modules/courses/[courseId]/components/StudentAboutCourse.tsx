"use client";

import { getCourseName } from "@/modules/shared/utils/helper";
import Image from "next/image";
import UserPhoto from "@/modules/shared/components/UserPhoto";
import { CourseAbout } from "@/modules/courses/[courseId]/types/typeCourseAbout";

function StudentAboutCourse({ course }: { course: CourseAbout }) {
  const photoSrc = course.photo?.startsWith("courses/")
    ? `/api/storage/object?key=${encodeURIComponent(course.photo)}`
    : course.photo;

  return (
    <div className="flex flex-col xl:flex-row gap-6 xl:gap-10 xl:min-w-6xl">
      {/* Left: Course info */}
      <div className="order-2 xl:order-1 flex-1">
        <h2 className="text-2xl font-semibold text-slate-800">
          {getCourseName(course.courseType || "")}
        </h2>

        <p className="mt-4 text-slate-700 text-sm sm:text-base leading-relaxed">
          {course.description}
        </p>

        <div className="mt-6">
          <h3 className="text-base font-medium text-slate-700">Instructor</h3>
          <div className="mt-4 flex items-center gap-3">
            <UserPhoto photoUrl={course.instructor?.user.photo} />
            <div className="min-w-0">
              <p className="text-slate-900 font-medium truncate">
                {`${course.instructor?.firstName ?? ""} ${
                  course.instructor?.lastName ?? ""
                }` || "—"}
              </p>
              <p className="text-slate-600 text-sm">
                {course.instructor?.title || ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Course image */}
      <div className="order-1 xl:order-2 flex-shrink-0">
        <div className="w-full flex justify-center xl:justify-start">
          {photoSrc ? (
            <Image
              src={photoSrc}
              alt={`${getCourseName(course.courseType || "")} cover`}
              width={400}
              height={300}
              className="object-cover h-40 w-[20rem]"
              unoptimized
            />
          ) : (
            <div className="flex h-40 w-[20rem] items-center justify-center text-slate-400 text-sm">
              No cover image
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentAboutCourse;
