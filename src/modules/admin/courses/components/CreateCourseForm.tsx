"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/modules/ui/button";
import {
  type CreateCourseFormData,
  createCourseSchema,
  DAY_VALUES,
} from "@/modules/admin/courses/validators/createCourseSchema";
import { useCreateCourse } from "@/modules/admin/courses/hooks/useCreateCourse";
import { useRouter } from "next/navigation";

type Instructor = { id: number; firstName: string; lastName: string };

export default function CreateCourseForm({
  instructors,
  onCloseModal,
}: {
  instructors: Instructor[];
  onCloseModal?: () => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      courseTypeName: "",
      description: "",
      courseFee: undefined as unknown as number, // will be coerced by zod
      totalSessions: undefined as unknown as number,
      days: [],
    },
  });
  const router = useRouter();
  const coverImage = watch("coverImage");
  const previewUrl = useMemo(() => {
    if (coverImage instanceof File) return URL.createObjectURL(coverImage);
    return undefined;
  }, [coverImage]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const { loading, createCourse } = useCreateCourse();

  const onSubmit = async (data: CreateCourseFormData) => {
    // Create CourseType (by name) + upload cover + create Course + CourseDay[]
    await createCourse({
      courseTypeName: data.courseTypeName.trim(),
      description: data.description,
      instructorId: data.instructorId,
      courseFee: data.courseFee,
      totalSessions: data.totalSessions,
      days: data.days,
      coverImage: data.coverImage,
    });

    reset();
    onCloseModal?.();
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-1 w-[min(100%,36rem)] grid grid-cols-2 gap-x-10"
    >
      {/* Course Type (new row) */}
      <div className="space-y-2">
        <label
          htmlFor="courseTypeName"
          className="text-sm font-medium text-slate-700"
        >
          Course Type
        </label>
        <input
          id="courseTypeName"
          type="text"
          placeholder="e.g., Video Editing"
          className="w-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-500"
          {...register("courseTypeName")}
        />
        {errors.courseTypeName && (
          <p className="text-xs text-red-600">
            {errors.courseTypeName.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="totalSessions"
          className="text-sm font-medium text-slate-700"
        >
          Total Sessions (No. Weeks)
        </label>
        <input
          id="totalSessions"
          min={0}
          inputMode="numeric"
          type="number"
          placeholder="e.g., 12"
          className="w-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-500"
          {...register("totalSessions")}
        />
        {errors.totalSessions && (
          <p className="text-xs text-red-600">{errors.totalSessions.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-slate-700"
        >
          Description
        </label>
        <textarea
          id="description"
          placeholder="Briefly describe the course..."
          rows={4}
          className="w-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-500"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Instructor */}
      <div className="space-y-2">
        <label
          htmlFor="instructorId"
          className="text-sm font-medium text-slate-700"
        >
          Instructor
        </label>
        <select
          id="instructorId"
          className="w-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-500"
          defaultValue=""
          {...register("instructorId")}
        >
          <option value="" disabled>
            Select an instructor…
          </option>
          {instructors.map((ins) => (
            <option key={ins.id} value={ins.id}>
              {ins.firstName} {ins.lastName}
            </option>
          ))}
        </select>
        {errors.instructorId && (
          <p className="text-xs text-red-600">{errors.instructorId.message}</p>
        )}
      </div>

      {/* Course Fee */}
      <div className="space-y-2">
        <label
          htmlFor="courseFee"
          className="text-sm font-medium text-slate-700"
        >
          Course Fee (LKR)
        </label>
        <input
          id="courseFee"
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          placeholder="e.g., 25000"
          className="w-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-500"
          {...register("courseFee")}
        />
        {errors.courseFee && (
          <p className="text-xs text-red-600">
            {errors.courseFee.message as string}
          </p>
        )}
      </div>

      {/* Days (checkboxes) */}
      <div className="space-y-2">
        <span className="text-sm font-medium text-slate-700">Course Days</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DAY_VALUES.map((d) => (
            <label
              key={d}
              className="flex items-center gap-1 text-sm text-slate-700"
            >
              <input
                type="checkbox"
                value={d}
                className="min-h-4 min-w-4 border-slate-300"
                {...register("days")}
              />
              <span>{d.charAt(0) + d.slice(1).toLowerCase()}</span>
            </label>
          ))}
        </div>
        {errors.days && (
          <p className="text-xs text-red-600">
            {errors.days.message as string}
          </p>
        )}
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <label
          htmlFor="coverImage"
          className="text-sm font-medium text-slate-700"
        >
          Cover Image
        </label>
        <input
          id="coverImage"
          type="file"
          accept="image/*"
          className="block w-full text-sm file:mr-4 file:border-0 file:bg-slate-700 file:px-3 file:py-1 file:cursor-pointer cursor-pointer file:text-white hover:file:bg-slate-700"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setValue("coverImage", (file ?? (undefined as unknown)) as File, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
        />
        {errors.coverImage && (
          <p className="text-xs text-red-600">
            {errors.coverImage.message as string}
          </p>
        )}
        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Preview"
            className="mt-2 h-[3rem] w-full max-w-[3rem] border border-slate-200 object-cover"
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 col-span-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            reset();
            onCloseModal?.();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || loading}>
          {isSubmitting || loading ? "Creating..." : "Create Course"}
        </Button>
      </div>
    </form>
  );
}
