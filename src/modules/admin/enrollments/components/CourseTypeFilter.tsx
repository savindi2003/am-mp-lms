"use client";

import { useEffect, useMemo, useState } from "react";
import type { CourseType } from "@prisma/client";
import { getCourseTypes } from "@/modules/admin/enrollments/services/apiEnrollment";
import { getCourseName } from "@/modules/shared/utils/helper";
import { useRouter, useSearchParams } from "next/navigation";

const PAGE_RESET_NUMBER = 1;

type Props = {
  getEnrollments: (
    pageReset?: number,
    courseTypeId?: number,
  ) => Promise<void> | void;
  disabled?: boolean;
};

export default function CourseTypeFilter({ getEnrollments, disabled }: Props) {
  // const [selected, setSelected] = useState<string>("");
  const [courseType, setCourseType] = useState<CourseType[] | []>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const selected = searchParams.get("courseType") ?? "";
  useEffect(() => {
    (async () => {
      const courseType = await getCourseTypes();
      setCourseType(courseType);
    })();
  }, []);
  const options = useMemo(() => {
    const set = new Set<string>();
    courseType.forEach((e) => e.name && set.add(e.name));
    return Array.from(set).sort(); 
  }, [courseType]);
  console.log(courseType);
  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("courseType", value);
    } else {
      params.delete("courseType");
    }
    params.set("page", PAGE_RESET_NUMBER.toString());
    // setSelected(value);
    router.push(`?${params.toString()}`);
    const [currentObj] = courseType.filter((c) => c.name === value && c.id);
    getEnrollments(
      PAGE_RESET_NUMBER,
      // value ? (value) : undefined
      currentObj?.id,
    );
  }

  return (
    <label className="flex items-center gap-2 text-sm my-5">
      <span className="text-slate-700">Course Type</span>
      <select
        className="border px-3 py-2"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">All</option>
        {options.map((t) => (
          <option key={t} value={t}>
            {getCourseName(t)}
          </option>
        ))}
      </select>
    </label>
  );
}
