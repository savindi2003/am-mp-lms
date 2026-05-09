"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { updateLecture } from "../services/apiLectureLinks";
import { Button } from "@/modules/ui/button";
import { createLectureLinkSchema } from "../validators/createLectureLinkSchema";

export default function LectureUpdateForm({
  lecture,
  courseId,
  onSuccess,
}: any) {

  const formatTimeLocal = (date: string) => {
    const d = new Date(date);

    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);

    const formData = {
      title: String(fd.get("title") || ""),
      meetingLink: String(fd.get("meetingLink") || ""),
      lectureDate: String(fd.get("lectureDate") || ""),
      fromTime: String(fd.get("fromTime") || ""),
      toTime: String(fd.get("toTime") || ""),
      month: String(fd.get("month") || ""),
    };

    const result = createLectureLinkSchema.safeParse(formData);

    if (!result.success) {
      toast.error(result.error.issues[0]?.message);

      return;
    }

    startTransition(async () => {
      try {
        await updateLecture(courseId, lecture.id, result.data);

        toast.success("Lecture updated");

        onSuccess?.();
      } catch {
        toast.error("Update failed");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 sm:min-w-2xl xl:min-w-5xl gap-2">

      <div>
        <label className="text-sm font-medium text-slate-700">
          Lecture Title
        </label>
        <input
          name="title"
          defaultValue={lecture.title}
          className="border p-2 w-full"

        />
      </div>


      <div>

        <label className="text-sm font-medium text-slate-700">
          Meeting Link
        </label>

        <input
          name="meetingLink"
          defaultValue={lecture.meetingLink}
          className="border p-2 w-full"
          placeholder="Meeting Link"
        />

      </div>


      <div>

        <label className="text-sm font-medium text-slate-700">
          Date
        </label>

        <input
          type="date"
          name="lectureDate"
          defaultValue={lecture.lectureDate?.slice(0, 10)}
          className="border p-2 w-full"
        />

      </div>


      <div>
        <label className="text-sm font-medium text-slate-700">
          From Time
        </label>
      </div>
      <input
        type="time"
        name="fromTime"
        defaultValue={
          lecture.fromTime ? formatTimeLocal(lecture.fromTime) : ""
        }
        className="border p-2 w-full"
      />

      <div>
        <label className="text-sm font-medium text-slate-700">
          To Time
        </label>
        <input
          type="time"
          name="toTime"
          defaultValue={
            lecture.toTime ? formatTimeLocal(lecture.toTime) : ""
          }
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">
          Access Month
        </label>

        <input
          name="month"
          defaultValue={lecture.month || ""}
          className="border p-2 w-full"
          placeholder="e.g. January"
        />
      </div>

      <div className="flex gap-2 pt-2 justify-end">

        <Button variant="gray" type="submit"
          disabled={isPending}>Edit</Button>

        <Button variant="secondary">Cancel</Button>


      </div>

    </form>
  );
}