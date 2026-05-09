"use client";

import Link from "next/link";
import { extractYoutubeId } from "@/modules/shared/utils/helper";
import { cn } from "@/lib/utils";
import { Button } from "@/modules/ui/button";
import { useGetCourseVideos } from "@/modules/courses/[courseId]/hooks/useGetCourseVideos";
import Empty from "@/modules/shared/components/Empty";
import { format } from "date-fns";
import { useMemo, useState } from "react";

export default function StudentCourseVideos({
  courseId,
  initial,
}: any) {
  const { videos, loading, error } = useGetCourseVideos(courseId, initial);

  // 🔥 GROUP BY MONTH
  const grouped = useMemo(() => {
    return videos.reduce((acc: any, v: any) => {
      const month = v.month || "UNKNOWN";
      if (!acc[month]) acc[month] = [];
      acc[month].push(v);
      return acc;
    }, {});
  }, [videos]);

  const months = Object.keys(grouped).sort();

  const currentMonth = new Date().toISOString().slice(0, 7);

  const [openMonth, setOpenMonth] = useState(currentMonth);
  const [showHistory, setShowHistory] = useState(false);

  // 🔥 split months
  const pastMonths = months.filter((m) => m < currentMonth);
  const futureMonths = months.filter((m) => m > currentMonth);
  const current = months.filter((m) => m === currentMonth);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-64 animate-pulse bg-yellow-100/60 border border-slate-200"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!videos.length) {
    return <Empty resourceName="course video" />;
  }

  return (
    <div className="space-y-4 mt-5">

      {/* SHOW HISTORY BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowHistory((prev) => !prev)}
          className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>

      {/*  PAST MONTHS */}
      {showHistory &&
        pastMonths.map((month) => (
          <MonthBlock
            key={month}
            month={month}
            grouped={grouped}
            openMonth={openMonth}
            setOpenMonth={setOpenMonth}
          />
        ))}

      {/*  CURRENT MONTH */}
      {current.map((month) => (
        <MonthBlock
          key={month}
          month={month}
          grouped={grouped}
          openMonth={openMonth}
          setOpenMonth={setOpenMonth}
          highlight
        />
      ))}

      {/* FUTURE MONTHS */}
      {futureMonths.map((month) => (
        <MonthBlock
          key={month}
          month={month}
          grouped={grouped}
          openMonth={openMonth}
          setOpenMonth={setOpenMonth}
        />
      ))}
    </div>
  );
}



function MonthBlock({
  month,
  grouped,
  openMonth,
  setOpenMonth,
  highlight,
}: any) {
  const isOpen = openMonth === month;

  return (
    <div className=" bg-white">

      {/* HEADER */}
      <div
        onClick={() => setOpenMonth(isOpen ? "" : month)}
        className="flex justify-between items-center cursor-pointer px-4 py-3 bg-gray-100 hover:bg-gray-200"
      >
        <h2 className="font-semibold text-sm">
          📅 {month} {highlight && "(Current)"}
        </h2>

        <span>{isOpen ? "▼" : "▶"}</span>
      </div>

      {/* CONTENT */}
      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">

          {grouped[month].map((v: any) => {
            const vid = extractYoutubeId(v.link);

            return (
              <article
                key={v.id}
                className="bg-yellow-100 border shadow-sm flex flex-col"
              >
                <div className="relative w-full h-44 bg-slate-100">
                  {vid ? (
                    <img
                      src={`https://i.ytimg.com/vi/${vid}/hqdefault.jpg`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs">
                      No thumbnail
                    </div>
                  )}
                </div>

                <div className="p-3 flex flex-col gap-2">

                  <h3 className="font-semibold text-sm line-clamp-2">
                    {v.title}
                  </h3>

                  <p className="text-xs text-gray-500">
                    {format(new Date(v.createdAt), "dd MMM yyyy")}
                  </p>

                  <Link href={v.link} target="_blank">
                    <Button className="w-full text-xs">
                      Open YouTube
                    </Button>
                  </Link>

                </div>
              </article>
            );
          })}

        </div>
      )}
    </div>
  );
}