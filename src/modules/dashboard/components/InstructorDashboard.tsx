import { Suspense } from "react";
import Spinner from "@/modules/shared/components/Spinner";
import InstructorCourseCardList from "@/modules/dashboard/components/InstructorCourseCardList";
import InstructorTodayLectureCards from "./InstructorTodayLectureCards";
import InstructorClassDetails from "./InstructorClassDetails";

function InstructorDashboard() {
  return (
    <>
      <div className="flex flex-col gap-5 md:gap-10">
        <Suspense fallback={<Spinner />}>

          <InstructorTodayLectureCards/>
          <InstructorClassDetails/>
          <InstructorCourseCardList/>   

        </Suspense>
      </div>
    </>
  );
}

export default InstructorDashboard;
