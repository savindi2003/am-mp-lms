import { auth } from "@/app/auth"
import { Suspense } from "react";
import Spinner from "@/modules/shared/components/Spinner";
import StudentClassCardList from "@/modules/dashboard/components/StudentClassCardList";
import StudentTodayLectureCards from "./StudentTodayLectureCards";

async function StudentDashboard() {
  const session = await auth();

  if (session?.user?.role !== "STUDENT") {
    return null;
  }

  const studentId = Number(session.user.id);
  


  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <StudentTodayLectureCards userId={studentId} />
        <StudentClassCardList />
      </Suspense>
    </div>
  );
}

export default StudentDashboard;
