import CourseCardList from "@/modules/courses/components/CourseCardList";
import { Suspense } from "react";
import Spinner from "@/modules/shared/components/Spinner";
import { getCurrentUser } from "@/modules/shared/data/action";
import { getInstructors } from "@/modules/courses/data/action";
import { auth } from "@/app/auth";
import CreateCourseButton from "@/modules/courses/components/CreateCourseButton";
import { getClassTypes } from "@/modules/courses/data/action";
import CreateClassButton from "@/modules/courses/components/CreateClassButton";
import ClassCardList from "@/modules/courses/components/ClassCardList";
import FreeClasses from "@/modules/courses/components/FreeClasses";
import ClassPackages from "@/modules/courses/components/ClassPackages";

export default async function Page() {
  const session = await auth();
  const role = session?.user.role;
  const user = await getCurrentUser();
  const instructors = await getInstructors();
  const classTypes = await getClassTypes();

  return (
    <div>
      <h1 className="my-5 text-3xl text-slate-800 font-semibold">Classes</h1>
      {role === "ADMIN" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5 sm:justify-items-center md:justify-items-end  lg:justify-items-end">
          <CreateClassButton instructors={instructors} />

          <FreeClasses/>
          <ClassPackages/>

          
        </div>
      )}
      <Suspense fallback={<Spinner />}>
        <ClassCardList role={role} classTypes={classTypes} />
        
      </Suspense>
    </div>
  );
}

