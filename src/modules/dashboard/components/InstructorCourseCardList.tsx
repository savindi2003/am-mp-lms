import CourseCardBox from "@/modules/shared/components/CardBox";
import InstructorCourseCard from "@/modules/dashboard/components/InstructorCourseCard";
import type { InstructorCourse } from "@/modules/dashboard/types/typeInstructorCourse";
import { getCoursesByInstructor } from "@/modules/dashboard/data/action";

async function InstructorCourseCardList() {
  const instructorCourses = await getCoursesByInstructor();

  // for testing:
  // await new Promise((r) => setTimeout(r, 2000));

  return (

    <div>

       <h3 className="text-2xl font-semibold mb-4">
                Classes
       </h3>

      <CourseCardBox>
      <CourseCardBox.Item
        data={instructorCourses}
        render={(course: InstructorCourse) => (
          <InstructorCourseCard course={course} key={course.id} />
        )}
      />
    </CourseCardBox>

    </div>
    
  );
}

export default InstructorCourseCardList;
