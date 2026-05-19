"use client";

import { useLectureLinks } from "../hooks/useLectureLinks";
import Spinner from "@/modules/shared/components/Spinner";
import Empty from "@/modules/shared/components/Empty";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Lock, Unlock } from "lucide-react";
import { formatDate, formatTime } from "@/lib/time";
import { getLectureStatus } from "@/lib/lectureStatus";


export default function StudentLectureLinks({
  courseId,
}: {
  courseId: number;
}) {
  const { links, accessMap, loading, error } = useLectureLinks(courseId);


  const [showHistory, setShowHistory] = useState(false);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const [openMonth, setOpenMonth] = useState<string>(currentMonth);
  const [now, setNow] = useState(new Date());

  // GROUP BY MONTH
  const grouped = useMemo(() => {
    return links.reduce((acc: any, item: any) => {
      const month = item.month;
      if (!acc[month]) acc[month] = [];
      acc[month].push(item);
      return acc;
    }, {});
  }, [links]);

  const allMonths = Object.keys(grouped).sort();

  const pastMonths = allMonths.filter((m) => m < currentMonth);
  const activeMonths = allMonths.filter((m) => m >= currentMonth);

  const isFirstWeek = () => new Date().getDate() <= 7;

  const getAccess = (month: string) => {
    const record = accessMap?.[month];

    if (record?.status === "PAID" || record?.status === "OVERRIDDEN") {
      return { locked: false };
    }

    if (month === currentMonth) {
      return { locked: !isFirstWeek() };
    }

    return { locked: true };
  };

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(id);
  }, []);

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!links.length) return <Empty resourceName="lecture" />;

  const renderMonth = (month: string) => {
    const isOpen = openMonth === month;
    const access = getAccess(month);
    const isCurrent = month === currentMonth;

    return (
      <div
        key={month}
        className={cn(
          "space-y-4 mt-5",
          isCurrent ? "border-green-500" : "bg-white"
        )}
      >
        {/* HEADER */}
        <div
          onClick={() => setOpenMonth(isOpen ? "" : month)}
          className="flex justify-between items-center px-4 py-3 bg-gray-100 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold">📅 {month}</h2>

            {access.locked ? (
              <Lock size={14} className="text-red-500" />
            ) : (
              <Unlock size={14} className="text-green-600" />
            )}
          </div>

          <span className={isOpen ? "rotate-90" : ""}>▶</span>
        </div>

        {/* CONTENT */}
        {isOpen &&
          (access.locked ? (
            <div className="p-5 text-center text-sm text-gray-500 space-y-2">
              <p>🔒 This content is locked for this month.</p>
              <p>
                If you’ve already paid, access will be activated soon. Otherwise, please complete your payment to unlock lectures.
              </p>

              <button className="text-blue-600 underline text-xs">
                Contact Support
              </button>
            </div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {grouped[month].map((lec: any) => {
                const liveStatus = getLectureStatus(lec);

                const isLive = liveStatus === "LIVE";
                const isScheduled = liveStatus === "SCHEDULED";
                const isCancelled = liveStatus === "CANCEL";
                const isCompleted = liveStatus === "COMPLETED";

                return (
                  <li
                    key={lec.id}
                    className={cn(
                      "bg-white border shadow-sm p-4 relative",
                      isCancelled && "opacity-60"
                    )}
                  >
                    {/* STATUS BADGE */}
                    <div className="flex justify-end mb-3">
                      <span
                        className={cn(
                          "text-[10px] px-2 py-1 rounded-full font-semibold",
                          isLive && "bg-red-100 text-red-600 animate-pulse",
                          isScheduled && "bg-yellow-100 text-yellow-700",
                          lec.status === "COMPLETED" &&
                          "bg-green-100 text-green-700",
                          isCancelled && "bg-gray-200 text-gray-500"
                        )}
                      >
                        {liveStatus}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">

                      {/* ICON */}
                      <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src="/meet.png"
                          alt="Google Meet"
                          className="h-6 w-6 sm:h-7 sm:w-7 object-contain"
                        />
                      </div>

                      {/* INFO */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">
                          {lec.title}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                          📅 {formatDate(lec.lectureDate)}
                        </p>

                        <p className="text-xs text-slate-500">
                          ⏰ {formatTime(lec.fromTime)} - {formatTime(lec.toTime)}
                        </p>
                      </div>
                    </div>

                    {/* JOIN BUTTON */}
                    <div className="mt-4">
                      <Link href={lec.meetingLink} target="_blank">
                        <button
                          disabled={isCancelled || isCompleted}
                          className={cn(
                            "w-full text-xs py-2 font-medium",
                            isLive &&
                            "bg-red-600 text-white",
                            isScheduled &&
                            "bg-green-600 text-white",
                            lec.status === "COMPLETED" &&
                            "bg-slate-200 text-slate-600",
                            isCancelled &&
                            "bg-gray-300 text-gray-500 cursor-not-allowed"
                          )}
                        >
                          {isLive
                            ? "Join LIVE 🔴"
                            : isScheduled
                              ? "Join Lecture"
                              : lec.status === "COMPLETED"
                                ? "Completed"
                                : "Cancelled"}
                        </button>
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          ))}
      </div>
    );
  };

  return (
    <div className="space-y-4 mt-5">

      {/* PAST MONTHS */}
      {showHistory && (
        <div className="mt-3">
          {pastMonths.map(renderMonth)}
        </div>
      )}

      {/* SHOW HISTORY BUTTON (same style as resources) */}
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



      {/* ACTIVE MONTHS */}
      {activeMonths.map(renderMonth)}


    </div>
  );
}

