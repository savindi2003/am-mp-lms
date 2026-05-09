import { CourseDetailsType } from "@/modules/shared/attendances/types/typeCourseDetails";
import { getCourseName } from "@/modules/shared/utils/helper";

function AttendanceWeekUpdate({
  weekNo,
  onWeekNo,
  updateCourseWeek,
  courseDetails,
  weekOptions,
  weekSaving,
  courseType,
}: {
  weekNo: number | string;
  updateCourseWeek: (v: string) => Promise<void>;
  courseDetails: CourseDetailsType;
  onWeekNo: (v: number | "") => void;
  weekSaving: boolean;
  weekOptions: number[];
  courseType: {
    id: number;
    name: string;
  };
}) {
  return (
    <div className="flex items-center gap-2">
      <p className="bg-slate-600 text-slate-50 px-2 text-sm">
        {getCourseName(courseType.name)}
      </p>
      <select
        value={weekNo}
        onChange={async (e) => {
          const v = e.currentTarget.value;
          onWeekNo(v ? Number(v) : "");
          await updateCourseWeek(v);
        }}
        disabled={!courseDetails || weekSaving}
      >
        {weekOptions.map((w) => (
          <option key={w} value={w}>
            {`Week ${w}${Number(weekNo) === w ? " (current)" : ""}`}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AttendanceWeekUpdate;
