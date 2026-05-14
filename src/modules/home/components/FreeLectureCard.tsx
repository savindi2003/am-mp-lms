"use client";

import { Button } from "@/modules/ui/button";
import { format, isAfter, isBefore } from "date-fns";
import Link from "next/link";
import Image from "next/image";

type FreeLecture = {
  id: number;
  title: string;
  description?: string;
  meetingLink: string;
  lectureDate: string;
  fromTime: string;
  toTime: string;

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

export default function FreeLectureCard({
  lecture,
}: {
  lecture: FreeLecture;
}) {

  const now = new Date();

  const startTime = new Date(lecture.fromTime);

  const endTime = new Date(lecture.toTime);

  // HIDE PAST LECTURES
  const isPast = isAfter(now, endTime);

  if (isPast) return null;

  // LIVE STATUS
  const isLive =
    isAfter(now, startTime) &&
    isBefore(now, endTime);

  return (
    <div className="relative w-full border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

      {/* STATUS BADGE */}
      <div className="absolute top-4 right-4">

        <span className="rounded-full bg-green-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-green-700">
            FREE
        </span>
        

      </div>

      {/* TOP */}
      <div className="flex items-start gap-4">

        {/* GOOGLE MEET ICON */}
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 shrink-0">

          <Image
            src="/meet.png"
            alt="Google Meet"
            width={32}
            height={32}
            className="object-contain"
          />

        </div>

        {/* TITLE */}
        <div className="flex-1 pr-12">

          <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-snug">
            {lecture.title}
          </h3>

          <p className="mt-1 text-sm font-semibold text-blue-600">
            {lecture.classType.name}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {lecture.instructor.title}{" with "}
            {lecture.instructor.firstName}{" "}
            {lecture.instructor.lastName}
          </p>

        </div>
      </div>

      {/* DATE & TIME */}
      <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-700 space-y-2">

        <div className="flex items-center gap-2">
          <span>📅</span>

          <span>
            {format(new Date(lecture.lectureDate), "PPP")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span>⏰</span>

          <span>
            {format(startTime, "hh:mm a")} -{" "}
            {format(endTime, "hh:mm a")}
          </span>
        </div>

      </div>

      {/* DESCRIPTION */}
      {lecture.description && (
        <p className="mt-4 text-sm leading-relaxed text-slate-600 line-clamp-3">
          {lecture.description}
        </p>
      )}

      {/* BUTTON */}
      <Link
        href={lecture.meetingLink}
        target="_blank"
        className="mt-5 block"
      >

        <Button
          className={`w-full h-11 text-sm font-semibold ${
            isLive
              ? "bg-red-600 hover:bg-red-700 animate-pulse text-white"
              : ""
          }`}
        >
          {isLive ? "Join Now" : "Join Class"}
        </Button>

      </Link>
    </div>
  );
}