"use client";

import { Button } from "@/modules/ui/button";
import { format, isAfter, isBefore } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarDays,
  Clock3,
  ArrowBigRight ,
  Video,
  PlayCircle,
} from "lucide-react";

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

export default function PastLectureCard({
  lecture,
}: {
  lecture: FreeLecture;
}) {
  const now = new Date();

  const startTime = new Date(lecture.fromTime);
  const endTime = new Date(lecture.toTime);

  const isPast = isAfter(now, endTime);

  if (!isPast) return (
    <p className="text-red-300 text-sm font-semibold">No previous sessions available</p>
  );

  const isLive =
    isAfter(now, startTime) &&
    isBefore(now, endTime);

  const link = lecture.meetingLink;

  // LINK TYPES
  const isYouTube =
    link.includes("youtube.com") ||
    link.includes("youtu.be");

  const isDrive =
    link.includes("drive.google.com");

  const isMeet =
    link.includes("meet.google.com");

  const isResource = isYouTube || isDrive;

  return (
      <div className="relative w-full border border-slate-200 bg-white p-3 sm:p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
  
        {/* STATUS */}
        <div className="flex justify-end my-2">
          <span className="rounded-full bg-red-100 px-2 sm:px-3 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-red-700">
            Completed
          </span>
        </div>
  
        {/* TOP */}
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
  
          {/* TITLE */}
          <div className="flex-1 pr-16 sm:pr-20">
  
            <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
              {lecture.title}
            </h3>
  
            <p className="mt-1 text-xs sm:text-sm font-semibold text-yellow-400">
              {lecture.classType.name}
            </p>
  
            <p className="mt-2 text-[11px] sm:text-xs text-slate-500">
              {lecture.instructor.title} with{" "}
              {lecture.instructor.firstName}{" "}
              {lecture.instructor.lastName}
            </p>
  
          </div>
        </div>
  
        {/* DATE & TIME */}
        <div className="mt-4 sm:mt-5 space-y-3 border border-blue-100 bg-slate-50 p-3 sm:p-4">
  
          <div className="flex items-start sm:items-center gap-3 text-sm text-slate-700">
  
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-white shadow-sm">
              <CalendarDays className="h-4 w-4 text-yellow-400" />
            </div>
  
            <div>
              <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide text-slate-400">
                Scheduled Date
              </p>
  
              <p className="text-sm font-semibold">
                {format(new Date(lecture.lectureDate), "PPP")}
              </p>
            </div>
  
          </div>
  
          <div className="flex items-start sm:items-center gap-3 text-sm text-slate-700">
  
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-white shadow-sm">
              <Clock3 className="h-4 w-4 text-yellow-400" />
            </div>
  
            <div>
              <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide text-slate-400">
                Scheduled Time
              </p>
  
              <p className="text-sm font-semibold">
                {format(startTime, "hh:mm a")} -{" "}
                {format(endTime, "hh:mm a")}
              </p>
            </div>
  
          </div>
  
        </div>
  
        {/* DESCRIPTION */}
        {lecture.description && (
          <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-600">
            {lecture.description}
          </p>
        )}
  
        {/* RESOURCE / MEET SECTION */}
        <div className="mt-5 border border-blue-100 bg-slate-50 p-3 sm:p-4">
  
          {/* LABEL */}
          <div className="mb-3">
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-yellow-700">
              {isMeet
                ? "Live Class Access"
                : "Class Resources"}
            </span>
          </div>
  
          <div className="flex flex-col sm:flex-row items-start gap-3">
  
            {/* ICON */}
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
  
              {isMeet ? (
                <Image
                  src="/meet.png"
                  alt="Google Meet"
                  width={26}
                  height={26}
                  className="object-contain"
                />
              ) : (
                <Video className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
              )}
  
            </div>
  
            <div className="flex-1 w-full">
  
              <h4 className="font-bold text-slate-800 text-sm sm:text-base">
  
                {isMeet
                  ? "Google Meet Live Session"
                  : "Video Learning Resource"}
  
              </h4>
  
              <p className="mt-1 text-[11px] sm:text-xs leading-relaxed text-slate-600">
  
                {isMeet
                  ? "Join live class session through Google Meet."
                  : "Watch class recording and learning materials."}
  
              </p>
  
            </div>
  
          </div>
  
          {/* BUTTON */}
          <div className="mt-4">
  
            <Link
              href={link}
              target="_blank"
              className="w-full"
            >
              <Button
                className={`w-full text-xs sm:text-sm ${isMeet
                  ? "disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                  : ""
                  }`}

                disabled={isMeet}
              >
  
                {isMeet ? (
                  <>
                    Join Now
                  </>
                ) : (
                  <>
                    
                    Watch Now
                  </>
                )}
  
              </Button>
            </Link>
  
          </div>
  
        </div>
      </div>
    );
}