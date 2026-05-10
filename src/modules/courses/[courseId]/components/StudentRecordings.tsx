"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Lock, Unlock, Video } from "lucide-react";

import Spinner from "@/modules/shared/components/Spinner";
import Empty from "@/modules/shared/components/Empty";

import { cn } from "@/lib/utils";
import { useRecordings } from "../hooks/useRecordings";

export default function StudentRecordings({
  courseId,
}: {
  courseId: number;
}) {
  const {
    recordings,
    accessMap,
    loading,
    error,
  } = useRecordings(courseId);

  const currentMonth =
    new Date().toISOString().slice(0, 7);

  const [openMonth, setOpenMonth] =
    useState(currentMonth);

  const [showHistory, setShowHistory] =
    useState(false);

  // GROUP
  const grouped = useMemo(() => {
    return recordings.reduce((acc: any, item: any) => {
      const month = item.month || "NO_MONTH";

      if (!acc[month]) {
        acc[month] = [];
      }

      acc[month].push(item);

      return acc;
    }, {});
  }, [recordings]);

  const allMonths = Object.keys(grouped).sort();

  const pastMonths = allMonths.filter(
    (m) => m < currentMonth
  );

  const activeMonths = allMonths.filter(
    (m) => m >= currentMonth
  );

  const isFirstWeek = () => {
    return new Date().getDate() <= 7;
  };

  const getAccess = (month: string) => {
    const record = accessMap?.[month];

    if (
      record?.status === "PAID" ||
      record?.status === "OVERRIDDEN"
    ) {
      return {
        locked: false,
      };
    }

    if (month === currentMonth) {
      return {
        locked: !isFirstWeek(),
      };
    }

    return {
      locked: true,
    };
  };

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="text-red-500">
        {error}
      </div>
    );
  }

  if (!recordings.length) {
    return <Empty resourceName="recordings" />;
  }

  const renderMonth = (month: string) => {
    const isOpen = openMonth === month;

    const access = getAccess(month);

    return (
      <div
        key={month}
        className="space-y-4 mt-5"
      >
        {/* HEADER */}
        <div
          onClick={() =>
            setOpenMonth(isOpen ? "" : month)
          }
          className="flex justify-between items-center px-4 py-3 bg-gray-100 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold">
              📅 {month}
            </h2>

            {access.locked ? (
              <Lock
                size={14}
                className="text-red-500"
              />
            ) : (
              <Unlock
                size={14}
                className="text-green-600"
              />
            )}
          </div>

          <span className={isOpen ? "rotate-90" : ""}>
            ▶
          </span>
        </div>

        {/* CONTENT */}
        {isOpen &&
          (access.locked ? (
            <div className="p-5 text-center text-sm text-gray-500 space-y-2">
              <p>
                🔒 This month's recordings are
                locked.
              </p>

              <p>
                Please complete payment to unlock
                recordings.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {grouped[month].map((rec: any) => (
                <div
                  key={rec.id}
                  className="border bg-white shadow-sm p-4 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100">
                      <Video
                        size={18}
                        className="text-red-600"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">
                        {rec.title}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1">
                        Uploaded on{" "}
                        {format(
                          new Date(rec.createdAt),
                          "PPP"
                        )}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={rec.link}
                    target="_blank"
                  >
                    <button
                      className={cn(
                        "w-full py-2 text-sm font-medium",
                        "bg-red-600 text-white"
                      )}
                    >
                      Watch Recording
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="space-y-4 mt-5">
      {/* HISTORY */}
      {showHistory && (
        <div>
          {pastMonths.map(renderMonth)}
        </div>
      )}

      {pastMonths.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() =>
              setShowHistory(!showHistory)
            }
            className="text-xs px-3 py-2 bg-gray-200 hover:bg-gray-300"
          >
            {showHistory
              ? "Hide History"
              : "Show History"}
          </button>
        </div>
      )}

      {/* ACTIVE */}
      {activeMonths.map(renderMonth)}
    </div>
  );
}