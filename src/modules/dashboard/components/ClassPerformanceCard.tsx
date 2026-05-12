"use client";

import { useEffect, useState } from "react";
import Spinner from "@/modules/shared/components/Spinner";

export default function ClassPerformanceCard({ classData }: any) {
  const [range, setRange] = useState<"TODAY" | "7D" | "30D">("TODAY");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(
      `/api/backend/class-performance?classId=${classData.id}&range=${range}`,
    )
      .then((res) => res.json())
      .then(setData);
  }, [range]);

  if (!data) {
    return (
      <div className="bg-white p-4 rounded-xl justify-center items-center flex h-48">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-slate-100 p-4 space-y-3 ">
      <h2 className="font-semibold text-slate-800">
        {data.classInfo?.description}
      </h2>

      <p className="text-xs text-slate-500">
        {data.classInfo?.classType?.name}
      </p>

      {/* RANGE */}
      <div className="flex gap-2">
        {["TODAY", "7D", "30D"].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r as any)}
            className={`px-2 py-1 text-xs cursor-pointer hover:scale-110 ${
              range === r
                ? "bg-yellow-500 text-white"
                : "bg-slate-100"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p>Total</p>
          <p className="font-bold">{data.totalStudents}</p>
        </div>

        <div>
          <p>Active</p>
          <p className="font-bold">{data.activeStudents}</p>
        </div>

        
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm pt-5">
        <div>
          <p>Enrollments</p>
          <p className="font-bold">{data.enrollments}</p>
        </div>
        <div>
          <p>Revenue</p>
          <p className="font-bold text-green-600">
            {data.revenue}
          </p>
        </div>

        <div className="col-span-2">
          <p>Payments</p>
          <p className="font-bold">{data.payments}</p>
        </div>
      </div>
    </div>
  );
}