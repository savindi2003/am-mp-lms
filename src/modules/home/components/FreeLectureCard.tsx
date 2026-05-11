"use client";

import { Button } from "@/modules/ui/button";
import { format } from "date-fns";
import Link from "next/link";

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
    return (
        <div className="min-w-[320px] max-w-[320px] border bg-white shadow-sm p-4 flex flex-col gap-3">

            {/* TOP */}
            <div className="flex items-start gap-3">

                <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center">
                    🎓
                </div>

                <div className="flex-1">

                    <h3 className="font-semibold text-xl">
                        {lecture.title}
                    </h3>

                    <p className=" text-slate-500 font-bold mt-1">
                        {lecture.classType.name}
                    </p>



                </div>
            </div>

            <div>

                <p className=" text-slate-500">
                    👨‍🏫 {lecture.instructor.firstName}{" "}
                    {lecture.instructor.lastName} (
                    {lecture.instructor.title})
                </p>


            </div>

            {/* TIME */}
            <div className="font-semibold font-sm">
                
                
                📅 {format(new Date(lecture.lectureDate), "PPP")} <br />

                ⏰ {format(new Date(lecture.fromTime), "hh:mm a")} -{" "}
                {format(new Date(lecture.toTime), "hh:mm a")}
            </div>

            {/* DESCRIPTION */}
            {lecture.description && (
                <p className="text-xs text-slate-600">
                    {lecture.description}
                </p>
            )}

            {/* BUTTON */}
            <Link href={lecture.meetingLink} target="_blank">

                <Button className="w-full text-xs">

                    Join Free Lecture

                </Button>

            </Link>
        </div>
    );
}