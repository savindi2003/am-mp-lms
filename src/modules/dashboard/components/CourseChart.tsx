"use client";

import React from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getCourseName } from "@/modules/shared/utils/helper";

type EnrollmentForChart = {
  id: number;
  course: {
    id: number;
    courseType: {
      name: string;
      id: number;
    };
  };
};

type Props = {
  enrollments: EnrollmentForChart[];
};

type ChartDatum = { name: string; value: number };

export default function StudentsByCourseChart({ enrollments }: Props) {
  const data: ChartDatum[] = React.useMemo(() => {
    const tally: Record<string, number> = {};
    (enrollments ?? []).forEach((e) => {
      const ct = e?.course?.courseType.name;
      const name = ct ? getCourseName(ct) : "Unknown";
      tally[name] = (tally[name] ?? 0) + 1;
    });
    return Object.entries(tally).map(([name, value]) => ({ name, value }));
  }, [enrollments]);

  const COLORS = [
    "#314158",
    "#fdc700",
    "#ffc658",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
    "#ff7f50",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
  ] as const;

  return (
    <div className="rounded-xl bg-white px-5 py-3 w-sm">
      {data.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500 m-auto w-fit">
          No enrollments yet.
        </p>
      ) : (
        <ResponsiveContainer height={210}>
          <PieChart>
            <Pie
              data={data}
              nameKey="name"
              dataKey="value"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
      <h2 className="text-base font-semibold text-slate-600 text-center">
        Enrollments by Course
      </h2>
    </div>
  );
}
