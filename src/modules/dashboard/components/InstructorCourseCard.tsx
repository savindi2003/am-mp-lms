import Image from "next/image";
import Link from "next/link";
import type { InstructorCourse } from "@/modules/dashboard/types/typeInstructorCourse";
import { Button } from "@/modules/ui/button";
import { getCourseName } from "@/modules/shared/utils/helper";

export default function InstructorCourseCard({
  course,
}: {
  course: InstructorCourse;
}) {
  const students = course._count?.enrollments ?? 0;
  const courseVideos = course._count?.courseYoutubeVideo ?? 0;
  const courseResources = course._count?.courseResource ?? 0;

  console.log(course.photo);
  return (
    <div className="w-full max-w-md bg-white border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition">
      <Image

        // src={`/api/storage/image?key=${encodeURIComponent(course.photo ?? "")}`}

         src={
    course.photo
      ? `/api/storage/image?key=${encodeURIComponent(course.photo)}`
      : "/default-class.jpg"
  }

        alt="Course thumbnail"
        width={400}
        height={250}
        className="w-full h-55"
        unoptimized
      />

      <div className="p-5 space-y-4">

        <div>
          <h4 className="text-base font-medium text-slate-400">
            {getCourseName(course.classType.name)}
          </h4>
          <h5 className="mb-2 text-xl font-semibold tracking-tight text-slate-800">
          {getCourseName(course.description)}
        </h5>
        </div>
        

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span className="text-slate-500">
            Enrollments:{" "}
            <span className="font-medium text-slate-700">{students}</span>
          </span>{" "}
          
          
          
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button asChild>
            <Link href={`/instructor/courses/${course.id}/enrollments`}>
              Enrollments
            </Link>
          </Button>
          <Button asChild variant="gray">
            <Link href={`/instructor/courses/${course.id}/resources`}>
              Resources
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
