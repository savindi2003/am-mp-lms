import CourseCardBox from "@/modules/shared/components/CardBox";
import StudentClassCard from "./StudentClassCard";
import { auth } from "@/app/auth";
import { getStudentById } from "@/modules/dashboard/data/action";
import Empty from "@/modules/shared/components/Empty";

async function StudentClassCardList() {
  const session = await auth();
  const id = Number(session?.user?.id);

  const student = await getStudentById(id);
  if (!student) return null;

  // const items = (student.enrollments ?? [])
  // .filter((e) => e.class)
  // .map((e) => {
  //   const presentCount = (e.Attendance ?? []).filter(
  //     (a) => a.present
  //   ).length;

  //   const denom = e.Attendance?.length ?? 0;

  //   return {
  //     class: e.class!,
  //     progress: denom ? Math.round((presentCount / denom) * 100) : 0,
  //     presentCount,
  //     denom,
  //   };  
  // });

  const items = (student.enrollments ?? [])
  .filter((e) => e.class)
  .map((e) => {
    const presentCount = (e.Attendance ?? []).filter(
      (a) => a.present
    ).length;

    const totalSessions =
      e.class?._count?.courseLectureLinks ?? 0;

    return {
      class: e.class!,
      progress: totalSessions
        ? Math.round((presentCount / totalSessions) * 100)
        : 0,
      presentCount,
      totalSessions,
    };
  });

  if (items.length === 0)
    return <Empty resourceName="enrolled classes" />;

  return (
    <CourseCardBox>
      <CourseCardBox.Item
        data={items}
        render={(item) => (
          <StudentClassCard
            key={item.class.id}
            classData={item.class}
            progress={item.progress}
            presentCount={item.presentCount}
            totalSessions={item.totalSessions}
          />
        )}
      />
    </CourseCardBox>
  );
}

export default StudentClassCardList;
