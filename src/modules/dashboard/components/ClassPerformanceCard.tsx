"use client";

import { useEffect, useState } from "react";
import Spinner from "@/modules/shared/components/Spinner";
import { cn } from "@/lib/utils";

type RangeType =
  | "TODAY"
  | "LAST_7_DAYS"
  | "LAST_30_DAYS";

const ranges: {
  value: RangeType;
  label: string;
}[] = [
  {
    value: "TODAY",
    label: "Today",
  },
  {
    value: "LAST_7_DAYS",
    label: "Last 7 Days",
  },
  {
    value: "LAST_30_DAYS",
    label: "Last 30 Days",
  },
];

export default function ClassPerformanceCard({
  classData,
}: any) {
  const [range, setRange] =
    useState<RangeType>("TODAY");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] =
    useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/backend/class-performance?classId=${classData.id}&range=${range}`
      );

      if (!res.ok) {
        throw new Error(
          "Failed to fetch class performance"
        );
      }

      const result = await res.json();

      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [range]);

  if (loading || !data) {
    return (
      <div className="bg-white p-4 flex items-center justify-center h-52">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-white border p-5 space-y-5 shadow-sm">
      
      {/* HEADER */}
      <div className="space-y-1">
        <h2 className="font-semibold text-slate-800 text-lg">
          {data.classInfo?.description}
        </h2>

        <p className="text-xs text-slate-500">
          {data.classInfo?.classType?.name}
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 flex-wrap">
        {ranges.map((item) => (
          <button
            key={item.value}
            onClick={() =>
              setRange(item.value)
            }
            className={cn(
              "px-3 py-1.5 text-xs transition cursor-pointer border",
              range === item.value
                ? "bg-yellow-500 text-white border-yellow-500"
                : "bg-white hover:bg-slate-100 border-slate-200"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-3">

        <MetricCard
          title="Total Students"
          value={data.totalStudents}
        />

        <MetricCard
          title="Active Students"
          value={data.activeStudents}
        />

        <MetricCard
          title="Enrollments"
          value={data.enrollments}
        />

        <MetricCard
          title="Payments"
          value={data.payments}
        />

      </div>

      {/* REVENUE */}
      <div className="border-t pt-4">
        <p className="text-sm text-slate-500">
          Revenue
        </p>

        <h3 className="text-2xl font-bold text-green-600">
          Rs. {data.revenue.toLocaleString()}
        </h3>
      </div>
    </div>
  );
}

/* METRIC CARD */
function MetricCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="bg-slate-50 border p-3">
      <p className="text-xs text-slate-500">
        {title}
      </p>

      <h3 className="text-lg font-bold text-slate-800 mt-1">
        {value}
      </h3>
    </div>
  );
}