"use client";

export default function TodaySnapshot({
  stats,
}: {
  stats: {
    students: number;
    enrollments: number;
    sales: number;
  };
}) {
  return (
    <div className="grid grid-cols-3 gap-3 bg-white p-4 rounded-xl">
      <div>
        <p className="text-sm text-slate-500">Today Students</p>
        <h2 className="text-xl font-semibold">{stats.students}</h2>
      </div>

      <div>
        <p className="text-sm text-slate-500">Today Enrollments</p>
        <h2 className="text-xl font-semibold">{stats.enrollments}</h2>
      </div>

      <div>
        <p className="text-sm text-slate-500">Today Sales</p>
        <h2 className="text-xl font-semibold">Rs {stats.sales}</h2>
      </div>
    </div>
  );
}