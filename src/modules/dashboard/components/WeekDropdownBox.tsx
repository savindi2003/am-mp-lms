import WeekDropdown from "@/modules/dashboard/components/WeekDropdown";
import {
  getCoursesForDashboard,
  updateCurrentWeekById,
} from "@/modules/dashboard/data/action";

async function WeekDropdownBox() {
  const courses = await getCoursesForDashboard();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl text-slate-700 font-semibold">Weeks</h2>
      {courses.map((course, i) => {
        async function handleUpdateWeek(week: number) {
          "use server";
          await updateCurrentWeekById(course.id, week);
        }

        return (
          <WeekDropdown
            key={course.id}
            course={course}
            onUpdateWeek={handleUpdateWeek}
          />
        );
      })}
    </div>
  );
}

export default WeekDropdownBox;
