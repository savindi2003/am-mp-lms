"use client";

import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import type { CourseLectureLink } from "../types/typeLectureLink";
import Empty from "@/modules/shared/components/Empty";
import Image from "next/image";
import { formatDate, formatTime } from "@/lib/time";
import { getLectureStatus } from "@/lib/lectureStatus";

export default function LectureLinkList({
  links,
}: {
  links: CourseLectureLink[];
}) {
  const [openMonth, setOpenMonth] = useState<string>("");
  const [showHistory, setShowHistory] = useState(false);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const [now, setNow] = useState(new Date());

  // GROUP BY MONTH (YYYY-MM)
  const grouped = useMemo(() => {
    return links.reduce((acc: any, item) => {
      const month = new Date(item.lectureDate)
        .toISOString()
        .slice(0, 7);

      if (!acc[month]) acc[month] = [];
      acc[month].push(item);
      return acc;
    }, {});
  }, [links]);

  const months = Object.keys(grouped).sort();

  const pastMonths = months.filter((m) => m < currentMonth);
  const current = months.filter((m) => m === currentMonth);
  const futureMonths = months.filter((m) => m > currentMonth);

    useEffect(() => {
      const id = setInterval(() => {
        setNow(new Date());
      }, 60000);
  
      return () => clearInterval(id);
    }, []);

  //  auto open current month
  useMemo(() => {
    if (!openMonth && current.length) {
      setOpenMonth(current[0]);
    }
  }, [current, openMonth]);

  if (!links?.length) {
    return <Empty resourceName="lecture" />;
  }

  const renderMonth = (month: string, highlight = false) => {
    const isOpen = openMonth === month;

    return (
      <div
        key={month}
        className="bg-white"
      >
        {/* HEADER */}
        <div
          onClick={() => setOpenMonth(isOpen ? "" : month)}
          className="flex justify-between items-center px-4 py-3 bg-gray-100 cursor-pointer"
        >
          <h2 className="text-sm font-semibold">
            📅 {month} {highlight && "(Current)"}
          </h2>

          <span className={isOpen ? "rotate-90" : ""}>▶</span>
        </div>

        {/* CONTENT */}
        {isOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {grouped[month].map((l: CourseLectureLink) => {
              const liveStatus = getLectureStatus(l);
              
                              const isLive = liveStatus === "LIVE";
                              const isScheduled = liveStatus === "SCHEDULED";
                              const isCancelled = liveStatus === "CANCEL";
                              const isCompleted = liveStatus === "COMPLETED";

              return (
                <div
                key={l.id}
                className={cn(
                  "border bg-white shadow-sm p-4 flex flex-col gap-3",
                  isCancelled && "opacity-60"
                )}
              >

                {/* STATUS ROW (separate) */}
                <div className="flex justify-end">
                  <span
                    className={cn(
                      "text-[10px] px-2 py-1 rounded-full font-semibold w-fit",
                      isLive && "bg-red-100 text-red-600 animate-pulse",
                      isScheduled && "bg-yellow-100 text-yellow-700",
                      l.status === "COMPLETED" && "bg-green-100 text-green-700",
                      isCancelled && "bg-gray-200 text-gray-500"
                    )}
                  >
                    {liveStatus}
                  </span>
                </div>

                {/* TOP ROW (ICON + TITLE) */}
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <Image src="/meet.png" alt="Google Meet" width={28} height={28} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">
                      {l.title}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      📅 {format(new Date(l.lectureDate), "dd MMM yyyy")}
                    </p>

                    <p className="text-xs text-slate-500">
                      ⏰ {formatTime(l.fromTime)} - {formatTime(l.toTime)}
                    </p>
                  </div>
                </div>


                {/* BUTTON */}
                <div className="mt-1">
                  <Link href={l.meetingLink} target="_blank">
                    <button
                      disabled={isCancelled}
                      className={cn(
                        "w-full text-xs py-2 font-medium",
                        isLive && "bg-red-600 text-white",
                        isScheduled && "bg-green-600 text-white",
                        l.status === "COMPLETED" &&
                          "bg-slate-200 text-slate-600",
                        isCancelled &&
                          "bg-gray-300 text-gray-500 cursor-not-allowed"
                      )}
                    >
                      {isLive
                        ? "Join LIVE 🔴"
                        : isScheduled
                        ? "Join Lecture"
                        : l.status === "COMPLETED"
                        ? "Completed"
                        : "Cancelled"}
                    </button>
                  </Link>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 mt-5">

      {/* HISTORY */}
      {showHistory && pastMonths.map((m) => renderMonth(m))}

      {/* BUTTON */}
      {pastMonths.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            {showHistory ? "Hide History" : "Show History"}
          </button>
        </div>
      )}

      {/* CURRENT */}
      {current.map((m) => renderMonth(m, true))}

      {/* FUTURE */}
      {futureMonths.map((m) => renderMonth(m))}
    </div>
  );
}