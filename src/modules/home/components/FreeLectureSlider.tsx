"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import FreeLectureCard from "./FreeLectureCard";

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

export default function FreeLectureSlider() {

  const [lectures, setLectures] = useState<FreeLecture[]>([]);

  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    (async () => {

      try {

        const res = await fetch(
          "/api/public/free-lectures"
        );

        const data = await res.json();

        setLectures(data);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);
      }

    })();

  }, []);

  const scroll = (
    direction: "left" | "right"
  ) => {

    if (!scrollRef.current) return;

    const {
      scrollLeft,
      clientWidth,
    } = scrollRef.current;

    const scrollAmount =
      direction === "left"
        ? -clientWidth
        : clientWidth;

    scrollRef.current.scrollTo({
      left: scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <p className="text-sm text-slate-500">
        Loading free lectures...
      </p>
    );
  }

  if (!lectures.length) {
    return (
      <p className="text-sm text-slate-500">
        No free lectures available
      </p>
    );
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">

        <h2 className="text-2xl font-semibold">
          Free Lectures
        </h2>

      </div>

      {/* LEFT */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-slate-50 p-2 rounded-full shadow hover:bg-yellow-100"
      >
        <ChevronLeft />
      </button>

      {/* RIGHT */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-slate-50 p-2 rounded-full shadow hover:bg-yellow-100"
      >
        <ChevronRight />
      </button>

      {/* TRACK */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth gap-4 px-10 py-6"
      >

        {lectures.map((lecture) => (

          <FreeLectureCard
            key={lecture.id}
            lecture={lecture}
          />

        ))}

      </div>
    </div>
  );
}