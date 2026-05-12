"use client";

import { useState } from "react";
import ClassCard from "./ClassCard";
import ClassFilter from "./ClassFilter";

export default function ClassListClient({
  initialClasses,
  role,
  classTypes,
}: any) {
  const [filter, setFilter] = useState("ALL");

  const filtered =
    filter === "ALL"
      ? initialClasses
      : initialClasses.filter(
          (c: any) => c.classType.name === filter
        );

  return (
    <div>
      {/* FILTER */}
      <ClassFilter
        classTypes={classTypes}
        onChange={setFilter}
      />

      {/* GRID */}
      <div className="grid grid-cols-2  md:grid-cols-3 gap-5 mt-5">
        {filtered.map((cls: any) => (
          <ClassCard key={cls.id} classItem={cls} role={role} />
        ))}
      </div>
    </div>
  );
}