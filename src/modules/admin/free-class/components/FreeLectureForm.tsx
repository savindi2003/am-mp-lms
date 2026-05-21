"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import toast from "react-hot-toast";

import {
  freeClassSchema,
  FreeLectureSchemaType,
} from "../validators/freeClassSchema";

import { useClassTypes } from "../hooks/useClassTypes";
import { useInstructors } from "../hooks/useInstructor";
import { Button } from "@/modules/ui/button";

type Props = {
  selectedLecture: any;
  onSubmitData: (data: any) => Promise<void>;
  onCancel: () => void;
};

export default function FreeLectureForm({
  selectedLecture,
  onSubmitData,
  onCancel,
}: Props) {
  const { classTypes } = useClassTypes();
  const { instructors } = useInstructors();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FreeLectureSchemaType>({
    resolver: zodResolver(freeClassSchema),

    defaultValues: {
      title: "",
      description: "",
      meetingLink: "",
      lectureDate: "",
      fromTime: "",
      toTime: "",
      classTypeId: "",
      instructorId: "",
    },
  });

  //  safe time formatter
  const formatTimeInput = (value: any) => {
    if (!value) return "";

    const date = new Date(value);

    if (isNaN(date.getTime())) return "";

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  //  fill form on edit
  useEffect(() => {
    if (selectedLecture) {
      reset({
        title: selectedLecture.title || "",
        description: selectedLecture.description || "",
        meetingLink: selectedLecture.meetingLink || "",
        lectureDate:
          selectedLecture.lectureDate?.split("T")[0] || "",

        fromTime: formatTimeInput(selectedLecture.fromTime),
        toTime: formatTimeInput(selectedLecture.toTime),

        classTypeId: String(selectedLecture.classType?.id || ""),
        instructorId: String(selectedLecture.instructor?.id || ""),
      });
    } else {
      reset({
        title: "",
        description: "",
        meetingLink: "",
        lectureDate: "",
        fromTime: "",
        toTime: "",
        classTypeId: "",
        instructorId: "",
      });
    }
  }, [selectedLecture, reset]);

  //  submit handler
  const onSubmit = async (data: FreeLectureSchemaType) => {
    try {
      await onSubmitData(data);

      toast.success(
        selectedLecture ? "Lecture updated" : "Lecture created"
      );

      reset();      // clear form
      onCancel();   // exit edit mode
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold text-slate-800">
        {selectedLecture ? "Update Free Class" : "Create Free Class"}
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-slate-200 p-5 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Session Title
            </label>
            <input
              {...register("title")}
              className="input w-full sm:w-md"
            />
            <p className="text-xs text-red-500 mt-1">
              {errors.title?.message}
            </p>
          </div>

          {/* MEETING LINK */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Meeting or Resource Link
            </label>
            <input
              {...register("meetingLink")}
              className="input w-full sm:w-md"
            />
            <p className="text-xs text-red-500 mt-1">
              {errors.meetingLink?.message}
            </p>
          </div>

          {/* CLASS TYPE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Grade
            </label>
            <select
              {...register("classTypeId")}
              className="input w-full sm:w-md"
            >
              <option value="">Select Grade</option>
              {classTypes.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* INSTRUCTOR */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Instructor
            </label>
            <select
              {...register("instructorId")}
              className="input w-full sm:w-md"
            >
              <option value="">Select Instructor</option>
              {instructors.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.firstName} {item.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* DATE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Date
            </label>
            <input
              type="date"
              {...register("lectureDate")}
              className="input w-full sm:w-md"
            />
          </div>

          {/* FROM TIME */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Time From
            </label>
            <input
              type="time"
              {...register("fromTime")}
              className="input w-full sm:w-md"
            />
          </div>

          {/* TO TIME */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Time To
            </label>
            <input
              type="time"
              {...register("toTime")}
              className="input w-full sm:w-md"
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Session Description
          </label>
          <textarea
            rows={4}
            {...register("description")}
            className="input w-full sm:w-md resize-none"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <Button disabled={isSubmitting}>
            {selectedLecture ? "Update" : "Create"}
          </Button>

          {selectedLecture && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                reset();    // clear form
                onCancel(); // exit edit mode
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}