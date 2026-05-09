"use client";
import React from "react";

type StatProps = {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  color: string; // e.g. "bg-white rounded-xl"
  valueSize?: string; // e.g. "md:text-2xl text-xl"
};

export default function Stat({
  icon,
  title,
  value,
  color,
  valueSize,
}: StatProps) {
  return (
    <div
      className={`${color} grid grid-rows-2 items-center justify-center px-5 py-3`}
    >
      <div className="flex items-center gap-3">
        <span>{icon}</span>
        <h2 className="text-sm font-semibold text-slate-500 uppercase md:text-base">
          {title}
        </h2>
      </div>
      <p
        className={`justify-self-center font-medium text-slate-600 dark:text-slate-100 ${valueSize ?? ""}`}
      >
        {value}
      </p>
    </div>
  );
}
