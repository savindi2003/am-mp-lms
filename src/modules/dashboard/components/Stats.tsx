"use client";

import React from "react";
import Stat from "./Stat";
import { formatCurrency } from "@/modules/shared/utils/helper";
import {
  PiBookThin,
  PiChartBarThin,
  PiMoneyWavyThin,
  PiStudentThin,
} from "react-icons/pi";

export type DashboardStats = {
  students: number;
  dueExpires: number;
  sales: number; // total payments
  totalEnrollments: number; // 0..100
  payRate: number;
};

export default function Stats({ stats }: { stats: DashboardStats }) {
  const { students, dueExpires, sales, totalEnrollments, payRate } = stats;

  return (
    <div className="grid grid-cols-2 gap-4 md:flex md:justify-between">
      <Stat
        title="Students" 
        icon={
          <PiStudentThin
            className="h-10 w-10 rounded-full bg-sky-200 p-2 text-slate-800 md:h-15 md:w-15 md:p-3"
            strokeWidth={1}
          />
        }
        value={students}
        color="bg-white rounded-xl"
        valueSize="md:text-2xl text-xl"
      />

      <Stat
        title="Enrollments"
        icon={
          <PiBookThin className="h-10 w-10 rounded-full bg-yellow-200 p-2 text-yellow-800 md:h-15 md:w-15 md:p-3 dark:bg-red-300" />
        }
        value={totalEnrollments}
        color="bg-white rounded-xl"
        valueSize="md:text-2xl text-xl"
      />

      <Stat
        title="Sales"
        icon={
          <PiMoneyWavyThin
            className="h-10 w-10 rounded-full bg-green-200 p-2 text-green-800 md:h-15 md:w-15 md:p-3 dark:bg-green-300"
            strokeWidth={1}
          />
        }
        value={`${formatCurrency(sales)}`}
        color="bg-white rounded-xl"
        valueSize="md:text-xl"
      />

      <Stat
        title="Pay Rate"
        icon={
          <PiChartBarThin
            className="h-10 w-10 rounded-full bg-amber-200 p-2 text-amber-800 md:h-15 md:w-15 md:p-3 dark:bg-amber-300"
            strokeWidth={1}
          />
        }
        value={`${payRate.toFixed(2)}%`}
        color="bg-white rounded-xl"
        valueSize="md:text-xl text-lg"
      />
    </div>
  );
}
