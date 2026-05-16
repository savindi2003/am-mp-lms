"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import Spinner from "@/modules/shared/components/Spinner";
import { formatDate, formatTime } from "@/lib/time";
import { getLectureStatus } from "@/lib/lectureStatus";

export default function StudentTodayLectureCards({ userId }: { userId: number }) {
    const [lectures, setLectures] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    

    const loadLectures = async () => {
        try {
            setLoading(true);

            const res = await fetch(
                `/api/backend/student/dashboard/today-lectures?studentId=${userId}`
            );

            const data = await res.json();

            if (Array.isArray(data)) {
                setLectures(data);
            } else {
                setLectures(data.lectures || []);
            }

        } catch (err) {
            console.error(err);
            setLectures([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // first load
        loadLectures();

        // auto refresh every minute
        const id = setInterval(() => {
            loadLectures();
        }, 60000);

        return () => clearInterval(id);
    }, []);

    return (
        <div className="p-5 bg-slate-100 mb-10">

            <h1 className="text-2xl font-semibold mb-4">
                Today Sessions
            </h1>

            {loading && (
                <Spinner/>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {!loading && lectures.length === 0 && (
                    <p className="text-gray-500">
                        No lectures today
                    </p>
                )}

                {lectures.map((lec) => {
                    const liveStatus = getLectureStatus(lec);

                    const isLive = liveStatus === "LIVE";
                    const isScheduled = liveStatus === "SCHEDULED";
                    const isCancelled = liveStatus === "CANCEL";
                    const isCompleted = liveStatus === "COMPLETED";

                    return (
                        <div
                            key={lec.id}
                            className={cn(
                                "bg-white p-4 flex flex-col gap-3",
                                isCancelled && "opacity-50"
                            )}
                        >

                            <div className="flex justify-start">
                                <span className="bg-slate-800 text-white text-xs p-1">
                                    {lec.class.classType.name}
                                </span>
                            </div>

                            <div className="text-slate-500 font-semibold">
                                {lec.class.description}
                            </div>

                            <div className="flex justify-between items-center">

                                <h3 className="font-semibold text-sm truncate">
                                    {lec.title}
                                </h3>

                                <span className={cn(
                                    "text-[10px] px-2 py-1 rounded-full font-semibold",
                                    isLive && "bg-red-100 text-red-600 animate-pulse",
                                    isScheduled && "bg-yellow-100 text-yellow-700",
                                    isCancelled && "bg-gray-200 text-gray-500"
                                )}>
                                    {liveStatus}
                                </span>

                            </div>

                            <div className="flex items-start gap-3">

                                <div className="h-11 w-11 flex items-center justify-center bg-slate-100 rounded-lg">
                                    <Image
                                        src="/meet.png"
                                        alt="meet"
                                        width={24}
                                        height={24}
                                    />
                                </div>

                                <div className="text-xs text-slate-500 leading-5">
                                    <div>
                                        📅 {format(new Date(lec.lectureDate), "PPP")}
                                    </div>

                                    <div>
                                        ⏰ {format(new Date(lec.fromTime), "hh:mm a")} -{" "}
                                        {format(new Date(lec.toTime), "hh:mm a")}
                                    </div>
                                </div>
                            </div>

                            <Link
                                href={lec.meetingLink}
                                target="_blank"
                            >
                                <button
                                    disabled={isCancelled}
                                    className={cn(
                                        "w-full text-xs py-2 font-medium cursor-pointer",
                                        isLive && "bg-red-600 text-white hover:bg-red-800",
                                        isScheduled && "bg-green-600 text-white hover:bg-green-800",
                                        isCancelled && "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    )}
                                >
                                    {isLive
                                        ? "Join LIVE 🔴"
                                        : isScheduled
                                            ? "Join Lecture"
                                            : "Unavailable"}
                                </button>
                            </Link>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}