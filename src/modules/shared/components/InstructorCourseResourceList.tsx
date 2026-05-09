"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { useDeleteCourseResource } from "@/modules/admin/resources/hooks/useDeleteCourseResource";
import { CourseResourceRow } from "@/modules/admin/resources/types/typeCourseResource";
import Empty from "@/modules/shared/components/Empty";
import Spinner from "@/modules/shared/components/Spinner";

function fmtBytes(n?: number | null) {
  if (!n || n <= 0) return "-";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0,
    v = n;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

function openUrl(key: string) {
  return `/api/storage/object?key=${encodeURIComponent(key)}`;
}

function downloadUrl(key: string, title: string) {
  return `/api/storage/object?key=${encodeURIComponent(
    key
  )}&dl=1&filename=${encodeURIComponent(title)}`;
}

export default function InstrutorCourseResourceList({
  courseId,
  items,
  onGetCourseResources,
  loading,
  isDeleteButton,
}: {
  courseId: number;
  items: CourseResourceRow[];
  onGetCourseResources: () => Promise<void>;
  loading: boolean;
  isDeleteButton: boolean;
}) {
  const { loading: deleteLoading, deleteCourseResource } =
    useDeleteCourseResource(courseId);

  //  GROUP BY MONTH
  const grouped = useMemo(() => {
    return items.reduce((acc: any, item: any) => {
      const month = item.month || "Unknown";
      if (!acc[month]) acc[month] = [];
      acc[month].push(item);
      return acc;
    }, {});
  }, [items]);

  const months = Object.keys(grouped);

  //  CURRENT MONTH
  const currentMonth = new Date().toISOString().slice(0, 7);

  const [openMonth, setOpenMonth] = useState(currentMonth);
  const [showHistory, setShowHistory] = useState(false);

  if (loading)
    return (
      <div className="my-2">
        <Spinner />
      </div>
    );

  if (!items.length) return <Empty resourceName="course resource" />;

  //  split months
  const pastMonths = months.filter((m) => m < currentMonth);
  const futureMonths = months.filter((m) => m > currentMonth);
  const current = months.filter((m) => m === currentMonth);

  return (
    <div className="space-y-4 mt-5">

      {/* HISTORY BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowHistory((prev) => !prev)}
          className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>

      {/*  PAST MONTHS (optional) */}
      {showHistory &&
        pastMonths.map((month) => (
          <MonthBlock
            key={month}
            month={month}
            items={grouped[month]}
            openMonth={openMonth}
            setOpenMonth={setOpenMonth}
            deleteCourseResource={deleteCourseResource}
            onGetCourseResources={onGetCourseResources}
            isDeleteButton={isDeleteButton}
          />
        ))}

      {/*  CURRENT MONTH */}
      {current.map((month) => (
        <MonthBlock
          key={month}
          month={month}
          items={grouped[month]}
          openMonth={openMonth}
          setOpenMonth={setOpenMonth}
          deleteCourseResource={deleteCourseResource}
          onGetCourseResources={onGetCourseResources}
          isDeleteButton={isDeleteButton}
          highlight
        />
      ))}

      {/*  FUTURE MONTHS */}
      {futureMonths.map((month) => (
        <MonthBlock
          key={month}
          month={month}
          items={grouped[month]}
          openMonth={openMonth}
          setOpenMonth={setOpenMonth}
          deleteCourseResource={deleteCourseResource}
          onGetCourseResources={onGetCourseResources}
          isDeleteButton={isDeleteButton}
        />
      ))}
    </div>
  );
}

/* MONTH BLOCK */
function MonthBlock({
  month,
  items,
  openMonth,
  setOpenMonth,
  deleteCourseResource,
  onGetCourseResources,
  isDeleteButton,
  highlight,
}: any) {
  const isOpen = openMonth === month;

  return (
    <div
      className="bg-white"
    >
      {/* HEADER */}
      <div
        onClick={() => setOpenMonth(isOpen ? "" : month)}
        className="flex justify-between items-center cursor-pointer px-4 py-3 bg-gray-100 hover:bg-gray-200"
      >
        <h2 className="font-semibold text-sm">
          📁 {month} {highlight && "(Current)"}
        </h2>

        <span>{isOpen ? "▼" : "▶"}</span>
      </div>

      {/* CONTENT */}
      {isOpen && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
          {items.map((r: CourseResourceRow) => {
            const isImg = (r.contentType ?? "").startsWith("image/");

            return (
              <li key={r.id} className="border p-3 bg-white shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="h-16 w-16 bg-slate-100 flex items-center justify-center overflow-hidden">
                    {isImg ? (
                      <Image
                        src={openUrl(r.s3Key)}
                        alt={r.title}
                        width={64}
                        height={64}
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="text-xs text-slate-500">
                        {(r.contentType ?? "file").split("/").pop()}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">
                      {r.title}
                    </div>

                    <div className="text-xs text-slate-500">
                      {fmtBytes(r.sizeBytes)} ·{" "}
                      {format(new Date(r.createdAt), "PPpp")}
                    </div>

                    <div className="mt-2 flex gap-2">
                      <Link
                        href={openUrl(r.s3Key)}
                        target="_blank"
                        className="bg-slate-800 text-white text-xs px-2 py-1"
                      >
                        Open
                      </Link>

                      <Link
                        href={downloadUrl(r.s3Key, r.title)}
                        className="border text-xs px-2 py-1"
                      >
                        Download
                      </Link>

                      {isDeleteButton && (
                        <button
                          onClick={async () => {
                            await deleteCourseResource(r.id);
                            await onGetCourseResources();
                          }}
                          className="bg-red-600 text-white text-xs px-2 py-1"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
