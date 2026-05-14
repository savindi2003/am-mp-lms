"use client";

import { useEffect, useState } from "react";
import Spinner from "@/modules/shared/components/Spinner";

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

  if (loading) {
    return (
      <Spinner/>
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
    <div className="w-full max-w-7xl mx-auto">
      
      <div className="grid gap-6 md:grid-cols-[1fr,2fr,auto] items-start md:items-center mb-8">
        <h3 className="text-xl sm:text-xl lg:text-2xl font-semibold text-slate-800">
            Free Classes
        </h3>

        <p className="text-slate-700 text-sm sm:text-base">Join our free live science classes and experience interactive learning with theory, revision, and paper discussions designed to help you achieve excellent results. 🚀</p>

      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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