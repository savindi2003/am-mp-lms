// src/app/instructor/courses/[courseId]/enrollments/page.tsx

import ClassEnrollmentTable from "@/modules/instructor/classes/components/ClassEnrollmentTable";

type Props = {
  params: Promise<{ courseId: string }>;
};

export default async function Page({ params }: Props) {
  const { courseId } = await params;

  const classId = Number(courseId); //  mapping

  if (isNaN(classId)) return <div>Invalid ID</div>;

  return <ClassEnrollmentTable classId={classId} />;
}