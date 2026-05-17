"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { formatDate, formatTime } from "@/lib/time";
import { getLectureStatus } from "@/lib/lectureStatus";
import Spinner from "@/modules/shared/components/Spinner";

export default function InstructorTodayLectureCards() {
    const [lectures, setLectures] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [now, setNow] = useState(new Date());

    const instructorId = 1; //  replace with session user id

    const loadLectures = async () => {
        try {
            setLoading(true);

            const res = await fetch(
                `/api/backend/instructor/dashboard?instructorId=${instructorId}`
            );

            if (!res.ok) {
                const text = await res.text();
                console.error(text);
                throw new Error("Failed to fetch lectures");
            }

            const data = await res.json();
            setLectures(data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     loadLectures();
    // }, []);

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
        <div className="p-5 bg-slate-100 ">

            <h1 className="text-2xl font-semibold mb-4">
                Upcomming Sessions
            </h1>

            {loading && (
                <Spinner />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {!loading && lectures.length === 0 && (
                    <p className="text-gray-500">
                        No lectures scheduled
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
                                isCancelled && "opacity-60"
                            )}
                        >

                            <div className="flex justify-start">
                                <span className="bg-slate-800 text-white font-semibold text-xs p-1">{lec.class.classType.name}</span>
                            </div>

                            <div className="flex justify-start">
                                <span className="text-slate-500 font-semibold">{lec.class.description}</span>
                            </div>

                            <div className="flex items-center justify-between">

                                <h3 className="font-semibold text-sm truncate">
                                    {lec.title}
                                </h3>

                                <span
                                    className={cn(
                                        "text-[10px] px-2 py-1 rounded-full font-semibold whitespace-nowrap",
                                        isLive && "bg-red-100 text-red-600 animate-pulse",
                                        isScheduled && "bg-yellow-100 text-yellow-700",
                                        isCompleted && "bg-green-100 text-green-700",
                                        isCancelled && "bg-gray-200 text-gray-500"
                                    )}
                                >
                                    {liveStatus}
                                </span>
                            </div>


                            <div className="flex items-start gap-3">


                                <div className="h-11 w-11 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                    <Image
                                        src="/meet.png"
                                        alt="Google Meet"
                                        width={24}
                                        height={24}
                                    />
                                </div>


                                <div className="flex flex-col text-xs text-slate-500 leading-5">
                                    <span>
                                        📅 {format(new Date(lec.lectureDate), "PPP")}
                                    </span>

                                    <span>
                                        ⏰ {formatTime(lec.fromTime)} - {formatTime(lec.toTime)}
                                    </span>
                                </div>
                            </div>


                            <div>
                                <Link href={lec.meetingLink} target="_blank">
                                    <button
                                        disabled={isCancelled}
                                        className={cn(
                                            "w-full text-xs py-2  font-medium transition",
                                            isLive && "bg-red-600 text-white hover:bg-red-700",
                                            isScheduled && "bg-green-600 text-white hover:bg-green-700",
                                            isCompleted && "bg-slate-200 text-slate-600",
                                            isCancelled && "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        )}
                                    >
                                        {isLive
                                            ? "Join LIVE 🔴"
                                            : isScheduled
                                                ? "Join Lecture"
                                                : isCompleted
                                                    ? "Completed"
                                                    : "Cancelled"}
                                    </button>
                                </Link>
                            </div>

                        </div>
                    );
                })}


            </div>
        </div>
    );
}

