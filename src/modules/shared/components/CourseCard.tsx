import Link from "next/link";
import Image from "next/image";
import UserPhoto from "@/modules/shared/components/UserPhoto";
import type { Course } from "@/modules/shared/types/typeCourse";
import UpdateCourseButton from "@/modules/courses/components/UpdateCourseButton";
import { CourseInstructor } from "@/modules/courses/types/typeCourseInstructor";
import CourseDeleteButton from "@/modules/courses/components/CourseDeleteButton";

async function CourseCard({
  course,
  role,
  instructors,
}: {
  course: Course;
  role: string | undefined;
  instructors: CourseInstructor[];
}) {
  const href =
    role === "ADMIN"
      ? `/admin/courses/${course.id}/resources`
      : role === "INSTRUCTOR"
        ? `/instructor/courses/${course.id}/resources`
        : `/courses/${course.id}/resources`;

  return (
    <div className="max-w-sm bg-slate-50 border border-slate-200 shadow-sm">
      <Link href={href}>
        <Image
          src={`/api/storage/image?key=${encodeURIComponent(course.photo)}`}
          alt="Course thumbnail"
          className="w-full h-55"
          width={400}
          height={250}
          unoptimized
        />
      </Link>
      <div className="p-5">
        <Link href="#">
          <h5 className="mb-2 text-2xl font-semibold tracking-tight text-slate-600">
            {course.courseType.name}
          </h5>
        </Link>
        <div className="flex gap-2">
          <UserPhoto
            photoUrl={
              course.instructor?.user?.photo
                ? course.instructor?.user?.photo
                : null
            }
          />
          <div>
            <h4 className="text-lg font-medium text-slate-600">{`${course.instructor?.firstName} ${course.instructor?.lastName}`}</h4>
            <p>{course.instructor?.title}</p>
          </div>
        </div>
      </div>
      {role === "ADMIN" && (
        <div className="flex gap-2 m-5 ml-auto w-fit">
          <CourseDeleteButton courseId={course.id} />
          <UpdateCourseButton instructors={instructors} courseId={course.id} />
        </div>
      )}
    </div>
  );
}

export default CourseCard;
