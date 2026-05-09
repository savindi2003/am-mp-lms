
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Button } from "@/modules/ui/button";
import { createLectureLinkSchema } from "../validators/createLectureLinkSchema";


export function AddLectureLinkForm({ onCreate, meetingLink }: { onCreate: any; meetingLink?: string | null; }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createLectureLinkSchema),
  });

  async function onSubmit(data: any) {
    try {
      await onCreate(data);
      toast.success("Lecture created successfully");
      reset();
    } catch {
      toast.error("Failed to create lecture");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-200 p-5 space-y-4">

      {/* TITLE */}
      <div>
        <label className="block text-sm font-medium mb-1">Lecture Title</label>
        <input {...register("title")} className="input w-full sm:w-md" placeholder="e.g., Java OOP - Lesson 1" />
        {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
      </div>

      {/* LINK */}
      <div>
        <label className="block text-sm font-medium mb-1">Meeting Link</label>
        <input
          type="hidden"
          {...register("meetingLink")}
          value={meetingLink || ""}
        />

        <input
          className="input w-full sm:w-md"
          value={meetingLink || ""}
          disabled
          readOnly
        />
      </div>

      {/* DATE */}
      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input type="date" {...register("lectureDate")} className="input w-full sm:w-md" />
        {errors.lectureDate && <p className="text-red-500 text-xs">{errors.lectureDate.message}</p>}
      </div>

      {/* FROM */}
      <div>
        <label className="block text-sm font-medium mb-1">From</label>
        <input type="time" {...register("fromTime")} className="input w-full sm:w-md" />
        {errors.fromTime && <p className="text-red-500 text-xs">{errors.fromTime.message}</p>}
      </div>

      {/* TO */}
      <div>
        <label className="block text-sm font-medium mb-1">To</label>
        <input type="time" {...register("toTime")} className="input w-full sm:w-md" />
        {errors.toTime && <p className="text-red-500 text-xs">{errors.toTime.message}</p>}
      </div>

      {/* ACCESS MONTH */}
      <div>
        <label className="block text-sm font-medium mb-1">Access Month</label>
        <input type="month" {...register("month")} className="input w-full sm:w-md" />
        {errors.month && <p className="text-red-500 text-xs">{errors.month.message}</p>}
      </div>

      <Button type="submit" className="w-full sm:w-auto">
        Schedule Lecture
      </Button>
    </form>
  );
}