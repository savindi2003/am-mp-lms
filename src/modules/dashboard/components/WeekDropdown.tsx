"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCourseName } from "@/modules/shared/utils/helper";
import toast from "react-hot-toast";
import Empty from "@/modules/shared/components/Empty";

export default function WeekDropdown({
  course,
  onUpdateWeek,
}: {
  course: {
    totalSessions: number;
    currentWeek: number;
    courseType: {
      name: string;
      id: number;
    };
  } | null;
  onUpdateWeek: (week: number) => Promise<void>;
}) {
  const [selected, setSelected] = useState("");
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const toastId = toast.loading("Saving...");
    try {
      setSelected(e.target.value);
      await onUpdateWeek(Number(e.target.value));
      toast.success("Week updated", { id: toastId });
      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  }
  if (!course) return <Empty resourceName="week data" />;
  return (
    <div className="flex items-center justify-between gap-8">
      <p className="bg-slate-500 text-slate-50 px-1">
        {getCourseName(course.courseType.name)}
      </p>
      <select
        name="myDropdown"
        id="myDropdown"
        value={selected}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option disabled value="" className="bg-slate-500 text-slate-50">
          Week {course.currentWeek} (current)
        </option>
        {Array.from({ length: course.totalSessions }, (_, i) => (
          <option key={i + 1} value={i + 1}>
            {course.currentWeek === i + 1
              ? `Week ${i + 1} (current)`
              : `Week ${i + 1}`}
          </option>
        ))}
      </select>
    </div>
  );
}
