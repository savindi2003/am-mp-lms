// app/courses/[courseId]/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { use } from "react";

export default function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  // ✅ unwrap the params Promise
  const { courseId } = use(params);
  const pathname = usePathname();

  const tabs = [
    {
      name: "Enrollments",
      href: `/instructor/courses/${courseId}/enrollments`,
    },
    { name: "Resources", href: `/instructor/courses/${courseId}/resources` },
  ];

  return (
    <div className="p-4">
      <div className="mb-4 border-b border-slate-200 dark:border-slate-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            const isResources = pathname.endsWith("resources");
            const isEnrollments = pathname.endsWith("enrollments");
            return (
              <li key={tab.name} className="me-2">
                <Link
                  href={tab.href}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    isActive
                      ? isResources
                        ? "border-slate-800 text-slate-800"
                        : isEnrollments
                          ? "border-yellow-400 text-yellow-400"
                          : ""
                      : "border-transparent text-slate-500 hover:text-slate-600 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300"
                  }`}
                >
                  {tab.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
