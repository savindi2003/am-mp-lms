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

  useEffect(() => {
    if (selectedLecture) {
      reset({
        title: selectedLecture.title,
        description: selectedLecture.description,

        meetingLink: selectedLecture.meetingLink,

        lectureDate:
          selectedLecture.lectureDate?.split("T")[0],

        fromTime:
          selectedLecture.fromTime?.slice(0, 16),

        toTime:
          selectedLecture.toTime?.slice(0, 16),

        classTypeId: String(
          selectedLecture.classType.id
        ),

        instructorId: String(
          selectedLecture.instructor.id
        ),
      });
    } else {
      reset();
    }
  }, [selectedLecture, reset]);

  const onSubmit = async (
    data: FreeLectureSchemaType
  ) => {
    try {
      await onSubmitData(data);

      toast.success(
        selectedLecture
          ? "Lecture updated"
          : "Lecture created"
      );

      reset();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="bg-white border rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6">
        {selectedLecture
          ? "Update Free Class"
          : "Create Free Class"}
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <input
              placeholder="Title"
              {...register("title")}
              className="w-full border rounded-xl px-4 py-3"
            />

            <p className="text-sm text-red-500 mt-1">
              {errors.title?.message}
            </p>
          </div>

          <div>
            <input
              placeholder="Meeting Link"
              {...register("meetingLink")}
              className="w-full border rounded-xl px-4 py-3"
            />

            <p className="text-sm text-red-500 mt-1">
              {errors.meetingLink?.message}
            </p>
          </div>

          <div>
            <select
              {...register("classTypeId")}
              className="w-full border rounded-xl px-4 py-3"
            >
              <option value="">
                Select Class Type
              </option>

              {classTypes.map((item: any) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>

            <p className="text-sm text-red-500 mt-1">
              {errors.classTypeId?.message}
            </p>
          </div>

          <div>
            <select
              {...register("instructorId")}
              className="w-full border rounded-xl px-4 py-3"
            >
              <option value="">
                Select Instructor
              </option>

              {instructors.map((item: any) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.firstName} {item.lastName}
                </option>
              ))}
            </select>

            <p className="text-sm text-red-500 mt-1">
              {errors.instructorId?.message}
            </p>
          </div>

          <div>
            <input
              type="date"
              {...register("lectureDate")}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <input
              type="datetime-local"
              {...register("fromTime")}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <input
              type="datetime-local"
              {...register("toTime")}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>
        </div>

        <textarea
          rows={4}
          placeholder="Description"
          {...register("description")}
          className="w-full border rounded-xl px-4 py-3 resize-none"
        />

        <div className="flex gap-3">
          <button
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            {selectedLecture
              ? "Update"
              : "Create"}
          </button>

          {selectedLecture && (
            <button
              type="button"
              onClick={onCancel}
              className="border px-6 py-3 rounded-xl"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}