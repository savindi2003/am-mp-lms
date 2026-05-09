
import { Suspense } from "react";
import Spinner from "@/modules/shared/components/Spinner";
import StudentClassCardList from "@/modules/dashboard/components/StudentClassCardList";

async function StudentDashboard() {
  return (
    <>
      <div>
        <Suspense fallback={<Spinner />}>
          <StudentClassCardList />
        </Suspense>
      </div>
    </>
  );
}

export default StudentDashboard;
