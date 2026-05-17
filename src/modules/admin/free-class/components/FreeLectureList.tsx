"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { formatDate, formatTime } from "@/lib/time";

export default function FreeLectureList({
  lectures,
  onEdit,
  onDelete,
}: any) {
  const grouped = useMemo(() => {
    return lectures.reduce((acc: any, item: any) => {
      const month = item.lectureDate?.slice(0, 7);
      if (!acc[month]) acc[month] = [];
      acc[month].push(item);
      return acc;
    }, {});
  }, [lectures]);

  const months = Object.keys(grouped);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const pastMonths = months.filter((m) => m < currentMonth);
  const futureMonths = months.filter((m) => m > currentMonth);
  const current = months.filter((m) => m === currentMonth);

  const [openMonth, setOpenMonth] = useState(currentMonth);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="mb-4 text-2xl font-semibold text-slate-800">
          Free Class Links
        </h2>

        <button
          onClick={() => setShowHistory((p) => !p)}
          className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>

      {/* PAST */}
      {showHistory &&
        pastMonths.map((month) => (
          <MonthBlock
            key={month}
            month={month}
            openMonth={openMonth}
            setOpenMonth={setOpenMonth}
            data={grouped}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}

      {/* CURRENT */}
      {current.map((month) => (
        <MonthBlock
          key={month}
          month={month}
          openMonth={openMonth}
          setOpenMonth={setOpenMonth}
          data={grouped}
          onEdit={onEdit}
          onDelete={onDelete}
          highlight
        />
      ))}

      {/* FUTURE */}
      {futureMonths.map((month) => (
        <MonthBlock
          key={month}
          month={month}
          openMonth={openMonth}
          setOpenMonth={setOpenMonth}
          data={grouped}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

/* ================= STATUS ================= */

function getFreeLectureStatus(lecture: any) {
  const now = new Date();
  const from = new Date(lecture.fromTime);
  const to = new Date(lecture.toTime);

  if (now >= from && now <= to) return "LIVE";
  if (now < from) return "UPCOMING";
  return "COMPLETED";
}

/* ================= MONTH BLOCK ================= */

function MonthBlock({
  month,
  openMonth,
  setOpenMonth,
  data,
  onEdit,
  onDelete,
  highlight,
}: any) {
  const isOpen = openMonth === month;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleEdit = (lec: any) => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  onEdit(lec);
};

  return (
    <div className="bg-white overflow-hidden">
      {/* HEADER */}
      <div
        onClick={() => setOpenMonth(isOpen ? "" : month)}
        className="flex justify-between items-center cursor-pointer px-4 py-3 bg-gray-100 hover:bg-gray-200"
      >
        <h3 className="font-semibold text-sm">
          📅 {month} {highlight && "(Current)"}
        </h3>
        <span>{isOpen ? "▼" : "▶"}</span>
      </div>

      {/* CONTENT */}
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4 items-stretch">
          {data[month].map((lec: any) => {
            const status = getFreeLectureStatus(lec);
            const isCompleted = status === "COMPLETED";

            return (
              <div
                key={lec.id}
                className={cn(
                  "border p-4 hover:shadow-sm transition flex flex-col h-full",
                  
                )}
              >
                {/* STATUS */}
                <span
                  className={cn(
                    "text-[10px] px-2 py-1 rounded-full font-semibold w-fit",
                    status === "LIVE" &&
                      "bg-red-100 text-red-600 animate-pulse",
                    status === "UPCOMING" &&
                      "bg-yellow-100 text-yellow-700",
                    status === "COMPLETED" &&
                      "bg-gray-200 text-gray-600"
                  )}
                >
                  {status}
                </span>

                {/* TOP CONTENT */}
                <div className="flex items-start gap-3 mt-2">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-slate-100">
                    <Image
                      src="/meet.png"
                      alt="Google Meet"
                      width={28}
                      height={28}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">{lec.title}</h3>
                    <p className="text-xs text-blue-600 font-semibold">
                      {lec.classType?.name}
                    </p>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="text-xs text-slate-600 mt-3">
                  <p
                    className={cn(
                      expandedId === lec.id ? "" : "line-clamp-2"
                    )}
                  >
                    {lec.description}
                  </p>

                  {lec.description?.length > 120 && (
                    <button
                      onClick={() =>
                        setExpandedId(
                          expandedId === lec.id ? null : lec.id
                        )
                      }
                      className="text-xs text-blue-600 mt-1"
                    >
                      {expandedId === lec.id ? "See less" : "See more"}
                    </button>
                  )}
                </div>

                {/* TIME */}
                <div className="mt-3 text-xs space-y-1">
                  <p>
                    📅 {format(new Date(lec.lectureDate), "PPP")}
                  </p>
                  <p>
                    ⏰ {formatTime(lec.fromTime)} - {formatTime(lec.toTime)}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="mt-auto flex gap-2 pt-4">
                  <button
                  
                    onClick={() => !isCompleted && handleEdit(lec)}
                    disabled={isCompleted}
                    className={cn(
                      "flex-1 text-xs py-2",
                      isCompleted
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white"
                    )}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => !isCompleted && onDelete(lec.id)}
                    disabled={isCompleted}
                    className={cn(
                      "flex-1 text-xs py-2",
                      isCompleted
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-600 text-white"
                    )}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}