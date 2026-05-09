"use client";

import { useRef } from "react";
import CourseCard from "@/modules/home/components/CourseCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CourseCardType } from "@/modules/home/types/typeCourseCard";

function CourseCardBox({ courses }: { courses: CourseCardType[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      {/* Left Button */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-slate-50 p-2 rounded-full shadow hover:bg-yellow-100"
      >
        <ChevronLeft />
      </button>

      {/* Right Button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-slate-50 p-2 rounded-full shadow hover:bg-yellow-100"
      >
        <ChevronRight />
      </button>

      {/* Scrollable Track */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth gap-4 px-10 py-6"
        style={{ scrollBehavior: "smooth" }}
      >
        {courses?.map((course) => (
          <CourseCard course={course} key={course.id} />
        ))}
      </div>
    </div>
  );
}

export default CourseCardBox;
