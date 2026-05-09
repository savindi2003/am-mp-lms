"use client";

import ClassPerformanceCard from "./ClassPerformanceCard";

export default function ClassCardsGrid({ classes }: any) {
  if (!classes.length) {
    return (
      <p className="text-slate-500 text-sm">No classes found.</p>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {classes.map((cls: any) => (
        <ClassPerformanceCard key={cls.id} classData={cls} />
      ))}
    </div>
  );
}