import Image from "next/image";
import Link from "next/link";
import UserPhoto from "@/modules/shared/components/UserPhoto";
import { CourseCardType } from "@/modules/home/types/typeCourseCard";

function CourseCard({ course }: { course: CourseCardType }) {
  
  return (
    <div className="max-w-sm bg-slate-200 border border-gray-200 shadow-sm min-w-xs">
      <Link href="#">
        <Image
          // src={course.photo}
          src={`/api/storage/image?key=${encodeURIComponent(course.photo)}`}
          alt="Course thumbnail"
          width={400}
          height={250}
          className="w-full h-55"
          unoptimized
        />
      </Link>
      <div className="p-5">
        <Link href="#">
          {/*<h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-800">*/}
          {/*  {getCourseName(course.courseType.name)}*/}
          {/*</h5>*/}
        </Link>
        <p className="mb-3 font-normal text-slate-700 dark:text-slate-400">
          {course.description}
        </p>
        <div className="flex gap-2">
          <UserPhoto photoUrl={course.instructor?.user?.photo} />
          <div>
            <h4 className="text-lg font-medium">{`${course.instructor?.firstName} ${course.instructor?.lastName}`}</h4>
            <p>{course.instructor?.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
