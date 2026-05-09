"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";

type Props = {
  enrollments: {
    class: {
      classType: {
        name: string;
      };
    };
  }[];
};

export default function EnrollmentsBarChart({ enrollments }: Props) {
  const COLORS = [
  "#314158",
  "#fdc700",
  "#00C49F",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

  const data = React.useMemo(() => {
    const map: Record<string, number> = {};

    enrollments.forEach((e) => {
      const name = e.class?.classType?.name || "Unknown";
      map[name] = (map[name] ?? 0) + 1;
    });

    

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [enrollments]);

  return (
    <div className="rounded-xl bg-white px-5 py-3 w-sm">
      {data.length === 0 ? (
        <p className="text-sm text-slate-500 text-center mt-5">
          No data available
        </p>
      ) : (
        <ResponsiveContainer height={210}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
  {data.map((entry, index) => (
    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
  ))}
</Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      <h2 className="text-base font-semibold text-slate-600 text-center">
        Enrollments by Class Type
      </h2>
    </div>
  );
}