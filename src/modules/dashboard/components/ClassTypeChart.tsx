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

type Props = {
  enrollments: {
    id: number;
    class: {
      classType: {
        name: string;
      };
    };
  }[];
};

export default function ClassTypeChart({ enrollments }: Props) {
  const data = React.useMemo(() => {
    const map: Record<string, number> = {};

    enrollments.forEach((e) => {
      const name = e.class.classType.name;
      map[name] = (map[name] ?? 0) + 1;
    });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [enrollments]);

  const COLORS = ["#314158", "#fdc700", "#8dd1e1", "#a4de6c", "#ff7f50"];

  return (
    <div className="rounded-xl bg-white px-5 py-3 w-sm">
      {data.length === 0 ? (
        <p className="text-sm text-slate-500">No enrollments yet</p>
      ) : (
        <ResponsiveContainer height={210}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              innerRadius={55}
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

      <h2 className="text-base font-semibold text-slate-600 text-center mt-2">
        Enrollments by Classes
      </h2>
    </div>
  );
}