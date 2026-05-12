import {
  getDashboardStats,
  getEnrollmentsForDashboard,
  sinceDays,
} from "@/modules/dashboard/data/action";

import ClassDashboard from "@/modules/dashboard/components/ClassDashboard";

import RangeFilter from "./RangeFilter";
import Stats from "./Stats";
import ClassTypeChart from "./ClassTypeChart";
import TodaySnapshot from "./TodaySnapshot";
import OverdueTable from "./OverdueTable";
import EnrollmentsBarChart from "@/modules/dashboard/components/EnrollmentsBarChart";
import { getEnrollmentTrend } from "@/modules/dashboard/data/action";

export default async function AdminDashboard({ last = 7 }: { last?: number }) {
  const since = sinceDays(last);

  const [stats, enrollments, trend] = await Promise.all([
  getDashboardStats(since),
  getEnrollmentsForDashboard(since),
  getEnrollmentTrend(since),
]);

  return (
    <div className="flex flex-col gap-15">

      {/* 1. TIME FILTER (TOP) */}
      <RangeFilter />

      {/* 2. KPI CARDS */}
      <Stats stats={stats} />

      
      {/* 4. CLASS TYPE CHART (REPLACED COURSE CHART) */}
      <div className="flex flex-col md:flex-row justify-center md:justify-between items-center">
        <ClassTypeChart enrollments={enrollments} />
        <EnrollmentsBarChart enrollments={enrollments} />
      </div>

      

      {/* 5. Classes */}
      <ClassDashboard />
     
    </div>
  );
}