import { getCourses } from "@/modules/dashboard/services/apiCourse";
import CardBox from "@/modules/shared/components/CardBox";
import CourseCard from "@/modules/shared/components/CourseCard";
import type { Course } from "@/modules/shared/types/typeCourse";
import { CourseInstructor } from "@/modules/courses/types/typeCourseInstructor";
import Empty from "@/modules/shared/components/Empty";

async function CourseCardList({
  role,
  instructors, 
}: {
  role: string | undefined;
  instructors: CourseInstructor[];
}) {
  const courses: Course[] = await getCourses();

  if (courses.length === 0) return <Empty resourceName="course" />;
  return (
    <CardBox>
      <CardBox.Item
        data={courses}
        render={(course) => (
          <CourseCard
            course={course}
            role={role}
            key={course.id}
            instructors={instructors}
          />
        )}
      />
    </CardBox>
  );
}

export default CourseCardList;
