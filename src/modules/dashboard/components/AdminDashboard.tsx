import {
  getDashboardStats,
  getEnrollmentsForDashboard,
  sinceDays,
} from "@/modules/dashboard/data/action";

import ClassDashboard from "@/modules/dashboard/components/ClassDashboard";

import RangeFilter from "./RangeFilter";
import Stats from "./Stats";
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

      <RangeFilter />
      <Stats stats={stats} />
      <ClassDashboard />
     
    </div>
  );
}