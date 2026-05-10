"use client";

import { useRecordings } from "../hooks/useRecordings";
import Spinner from "@/modules/shared/components/Spinner";
import Empty from "@/modules/shared/components/Empty";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Video } from "lucide-react";

export default function InstructorRecordingsManager({
    courseId,
}: {
    courseId: number;
}) {
    const { recordings, loading, error } = useRecordings(courseId);

    const [openMonth, setOpenMonth] = useState<string>("");
    const [showHistory, setShowHistory] = useState(false);

    const currentMonth = new Date().toISOString().slice(0, 7);

    // GROUP BY MONTH
    const grouped = useMemo(() => {
        return recordings.reduce((acc: any, item: any) => {
            const month = item.month || "NO-MONTH";

            if (!acc[month]) acc[month] = [];
            acc[month].push(item);

            return acc;
        }, {});
    }, [recordings]);

    const months = Object.keys(grouped).sort();

    const pastMonths = months.filter((m) => m < currentMonth);
    const current = months.filter((m) => m === currentMonth);
    const futureMonths = months.filter((m) => m > currentMonth);

    if (loading) return <Spinner />;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!recordings.length) return <Empty resourceName="Recordings" />;

    const renderMonth = (month: string, highlight = false) => {
        const isOpen = openMonth === month;

        return (
            <div key={month} className="bg-white">

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

                        {grouped[month].map((r: any) => (
                            <div
                                key={r.id}
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
                                            {r.title}
                                        </h3>

                                        <p className="text-xs text-slate-500 mt-1">
                                            Uploaded on{" "}
                                            {format(
                                                new Date(r.createdAt),
                                                "PPP"
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href={r.link}
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
                        className="text-xs px-3 py-2 bg-gray-200 rounded-md"
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