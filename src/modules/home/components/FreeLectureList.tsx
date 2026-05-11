"use client";

import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Empty from "@/modules/shared/components/Empty";

type FreeLecture = {
  id: number;
  title: string;
  description?: string;
  meetingLink: string;
  lectureDate: string;
  fromTime: string;
  toTime: string;
  month?: string;

  classType: {
    id: number;
    name: string;
  };

  instructor: {
    id: number;
    firstName: string;
    lastName: string;
    title: string;
  };
};

export default function FreeLectureList() {
  const [lectures, setLectures] = useState<FreeLecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMonth, setOpenMonth] = useState<string>("");
  const [showHistory, setShowHistory] = useState(false);

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/public/free-lectures");
        const data = await res.json();
        setLectures(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // GROUP BY MONTH
  const grouped = useMemo(() => {
    return lectures.reduce((acc: any, item) => {
      const month =
        item.month ??
        new Date(item.lectureDate).toISOString().slice(0, 7);

      if (!acc[month]) acc[month] = [];
      acc[month].push(item);
      return acc;
    }, {});
  }, [lectures]);

  const months = Object.keys(grouped).sort();

  const pastMonths = months.filter((m) => m < currentMonth);
  const currentMonths = months.filter((m) => m === currentMonth);
  const futureMonths = months.filter((m) => m > currentMonth);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading lectures...</p>;
  }

  if (!lectures.length) {
    return <Empty resourceName="Free Lectures" />;
  }

  const renderMonth = (month: string, highlight = false) => {
    const isOpen = openMonth === month;

    return (
      <div key={month} className="bg-white border mb-4">

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

            {grouped[month].map((lec: FreeLecture) => (
              <div
                key={lec.id}
                className="border bg-white shadow-sm p-4 flex flex-col gap-3"
              >

                {/* TOP ICON + INFO */}
                <div className="flex items-start gap-3">

                  <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center">
                    🎓
                  </div>

                  <div className="flex-1">

                    <h3 className="font-semibold text-sm">
                      {lec.title}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      {lec.classType.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      👨‍🏫 {lec.instructor.firstName}{" "}
                      {lec.instructor.lastName} ({lec.instructor.title})
                    </p>

                  </div>
                </div>

                {/* TIME */}
                <div className="text-xs text-slate-500">
                  📅 {format(new Date(lec.lectureDate), "PPP")} <br />
                  ⏰ {format(new Date(lec.fromTime), "hh:mm a")} -{" "}
                  {format(new Date(lec.toTime), "hh:mm a")}
                </div>

                {/* DESCRIPTION */}
                {lec.description && (
                  <p className="text-xs text-slate-600">
                    {lec.description}
                  </p>
                )}

                {/* JOIN BUTTON */}
                <Link href={lec.meetingLink} target="_blank">
                  <button className="w-full text-xs py-2 bg-green-600 text-white font-medium hover:bg-green-700">
                    Join Free Lecture
                  </button>
                </Link>

              </div>
            ))}

          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">

      {/* HISTORY BUTTON */}
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

      {/* PAST */}
      {showHistory && pastMonths.map((m) => renderMonth(m))}

      {/* CURRENT */}
      {currentMonths.map((m) => renderMonth(m, true))}

      {/* FUTURE */}
      {futureMonths.map((m) => renderMonth(m))}
    </div>
  );
}


