

"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { useDeleteCourseResource } from "@/modules/admin/resources/hooks/useDeleteCourseResource";
import { CourseResourceRow } from "@/modules/admin/resources/types/typeCourseResource";
import Empty from "@/modules/shared/components/Empty";
import Spinner from "@/modules/shared/components/Spinner";
import { useResourceAccess } from "@/modules/shared/hooks/useGetResourceAccess";
import { Lock, Unlock } from "lucide-react";

function fmtBytes(n?: number | null) {
  if (!n || n <= 0) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0,
    v = n;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(1)} ${units[i]}`;
}

function openUrl(key: string) {
  return `/api/storage/object?key=${encodeURIComponent(key)}`;
}

function downloadUrl(key: string, title: string) {
  return `/api/storage/object?key=${encodeURIComponent(
    key
  )}&dl=1&filename=${encodeURIComponent(title)}`;
}

export default function CourseResourceList({
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
  const { deleteCourseResource } = useDeleteCourseResource(courseId);
  const { accessMap } = useResourceAccess(courseId);

  const grouped = useMemo(() => {
    return items.reduce((acc: any, item: any) => {
      const month = item.month || "Unknown";
      if (!acc[month]) acc[month] = [];
      acc[month].push(item);
      return acc;
    }, {});
  }, [items]);

  const months = Object.keys(grouped);
  const currentMonth = new Date().toISOString().slice(0, 7);

  const [openMonth, setOpenMonth] = useState(currentMonth);
  const [showHistory, setShowHistory] = useState(false);

  const isFirstWeek = () => new Date().getDate() <= 7;

  const getAccess = (month: string) => {
    const record = accessMap?.[month];

    // Paid or manually overridden
    if (record?.status === "PAID" || record?.status === "OVERRIDDEN") {
      return { locked: false };
    }

    // Current month always open
    if (month === currentMonth) {
      return { locked: false };
    }

    // Everything else locked
    return { locked: true };
  };

  if (loading) return <Spinner />;
  if (!items.length) return <Empty resourceName="course resource" />;

  const pastMonths = months.filter((m) => m < currentMonth);
  const current = months.filter((m) => m === currentMonth);
  const futureMonths = months.filter((m) => m > currentMonth);

  return (
    <div className="space-y-4 mt-5">

      {/* HISTORY BUTTON */}
      {pastMonths.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs bg-gray-200 px-3 py-1 rounded"
          >
            {showHistory ? "Hide History" : "Show History"}
          </button>
        </div>
      )}

      {/* PAST */}
      {showHistory &&
        pastMonths.map((m) => (
          <MonthBlock key={m} month={m} items={grouped[m]} {...{
            openMonth, setOpenMonth, deleteCourseResource,
            onGetCourseResources, isDeleteButton, getAccess
          }} />
        ))}

      {/* CURRENT */}
      {current.map((m) => (
        <MonthBlock key={m} month={m} items={grouped[m]} highlight {...{
          openMonth, setOpenMonth, deleteCourseResource,
          onGetCourseResources, isDeleteButton, getAccess
        }} />
      ))}

      {/* FUTURE */}
      {futureMonths.map((m) => (
        <MonthBlock key={m} month={m} items={grouped[m]} {...{
          openMonth, setOpenMonth, deleteCourseResource,
          onGetCourseResources, isDeleteButton, getAccess
        }} />
      ))}
    </div>
  );
}

function MonthBlock({
  month,
  items,
  openMonth,
  setOpenMonth,
  deleteCourseResource,
  onGetCourseResources,
  isDeleteButton,
  highlight,
  getAccess,
}: any) {
  const isOpen = openMonth === month;
  const access = getAccess(month);

  return (
    <div>

      {/* HEADER */}
      <div
        onClick={() => setOpenMonth(isOpen ? "" : month)}
        className="flex justify-between items-center px-4 py-3 bg-gray-100 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">
            📁 {month} {highlight && "(Current)"}
          </h2>

          {access.locked ? (
            <Lock size={14} className="text-red-500" />
          ) : (
            <Unlock size={14} className="text-green-600" />
          )}
        </div>

        <span>{isOpen ? "▼" : "▶"}</span>
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
        ))}
    </div>
  );
}