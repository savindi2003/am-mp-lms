"use client";

import { useState } from "react";
import { useLectureLinks } from "../hooks/useLectureLinks";
import { AddLectureLinkForm } from "./AddLectureLinkForm";
import { LectureLinkList } from "../../../shared/components/LectureLinkList";
import Spinner from "@/modules/shared/components/Spinner";

export function LectureManager({
  courseId,
  meetingLink,
}: {
  courseId: number;
  meetingLink?: string | null;
}) {
  const { links, loading, onAdd, getLinks } = useLectureLinks(courseId);

  const [open, setOpen] = useState(false);

  const handleStatusChange = async () => {
    await getLinks();
  };

  return (
    <div className="space-y-4">

      {/* Add Form */}
      <AddLectureLinkForm onCreate={onAdd} meetingLink={meetingLink}/>

      {/* Header Toggle (Accordion Button) */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between cursor-pointer bg-slate-200 hover:bg-slate-300 px-4 py-2 transition"
      >
        <h2 className="text-sm font-semibold text-gray-700">
          Lecture Links
        </h2>

        {/* Arrow Icon */}
        <span className="text-lg transition-transform">
          {open ? "▼" : "▶"}
        </span>
      </div>

      {/* Collapsible Section */}
      {open && (
        <div className="p-3 space-y-3">

          {loading && <Spinner />}

          {!loading && (
            <LectureLinkList
              links={links}
              courseId={courseId}
              onStatusChange={handleStatusChange}
            />
          )}

        </div>
      )}
    </div>
  );
}