import { auth } from "@/app/auth";
import Spinner from "@/modules/shared/components/Spinner";
import { Suspense } from "react";
import AdminDashboard from "@/modules/dashboard/components/AdminDashboard";
import InstructorDashboard from "@/modules/dashboard/components/InstructorDashboard";
import StudentDashboard from "@/modules/dashboard/components/StudentDashboard";

// app/page.tsx (or your home route)
export const dynamic = "force-dynamic";

function parseDays(v?: string) {
  const n = Number(v);
  return [7, 30, 90].includes(n) ? n : 7;
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ last?: string }>;
}) {
  const session = await auth();
  const role = session?.user?.role;
  const last = parseDays((await searchParams)?.last);

  return (
    <div className="container mx-auto px-4 md:px-0 lg:px-0">
      <h1 className="text-3xl font-semibold text-slate-800 my-5 mb-10">
        {session?.user.role === "ADMIN" ? "Dashboard" : "Home"}
      </h1>

      <div>
        <Suspense fallback={<Spinner />}>
          {role === "INSTRUCTOR" ? (
            <InstructorDashboard />
          ) : role === "ADMIN" ? (
            <AdminDashboard last={last} />
          ) : (
            <StudentDashboard />
          )}
        </Suspense>
      </div>
    </div>
  );
}
