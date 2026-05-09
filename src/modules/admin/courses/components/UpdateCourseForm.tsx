"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/modules/ui/button";
import { DAY_VALUES } from "@/modules/admin/courses/validators/createCourseSchema";
import { useGetCourse } from "@/modules/admin/courses/hooks/useGetCourse";
import { useUpdateCourse } from "@/modules/admin/courses/hooks/useUpdateCourse";
import { useRouter } from "next/navigation";

type Day = (typeof DAY_VALUES)[number];
type Instructor = { id: number; firstName: string; lastName: string };

// ----- schema & types -----
const updateCourseSchema = z.object({
  id: z.number().int().positive(),
  courseTypeName: z.string().min(1, "Course type is required"),
  description: z.string().min(1, "Description is required"),
  instructorId: z.coerce
    .number()
    .int()
    .positive({ message: "Select an instructor" }),
  totalSessions: z.coerce
    .number()
    .int()
    .positive({ message: "Enter a positive value" }),
  courseFee: z.coerce
    .number()
    .int()
    .nonnegative({ message: "Enter a valid fee" }),
  days: z.array(z.enum(DAY_VALUES)).min(1, "Pick at least one day"),
  coverImage: z.instanceof(File).optional(), // optional on update
});

export type UpdateCourseFormData = z.infer<typeof updateCourseSchema>;

export default function UpdateCourseForm({
  courseId,
  instructors,
  onCloseModal,
}: {
  courseId: number;
  instructors: Instructor[];
  onCloseModal?: () => void;
}) {
  const originalTypeNameRef = useRef<string>("");
  const router = useRouter();
  const { loading, course, error } = useGetCourse(courseId);
  const { loading: saving, updateCourse } = useUpdateCourse();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updateCourseSchema),
    defaultValues: {
      id: courseId,
      courseTypeName: "",
      description: "",
      instructorId: undefined as unknown as number,
      courseFee: undefined as unknown as number,
      totalSessions: undefined as unknown as number,
      days: [],
      coverImage: undefined,
    },
  });

  // current cover from server (S3 key) to preview existing image
  const [currentCoverKey, setCurrentCoverKey] = useState<string | null>(null);

  // when course loads, populate the form
  useEffect(() => {
    if (!course) return;
    originalTypeNameRef.current = course.courseType?.name ?? "";

    reset({
      id: course.id,
      courseTypeName: course.courseType?.name ?? "",
      description: course.description ?? "",
      instructorId: course.instructorId,
      courseFee: course.courseFee,
      totalSessions: course.totalSessions,
      days: Array.isArray(course.courseDay)
        ? course.courseDay.map((d: { day: Day }) => d.day)
        : [],
      coverImage: undefined,
    });
    setCurrentCoverKey(course.photo ?? null);
  }, [course, reset]);

  // new cover preview (local)
  const newCover = watch("coverImage");
  const previewUrl = useMemo(() => {
    if (newCover instanceof File) return URL.createObjectURL(newCover);
    return undefined;
  }, [newCover]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const submit = async (data: UpdateCourseFormData) => {
    await updateCourse({
      id: data.id,
      currentCourseTypeName: originalTypeNameRef.current, // 👈 send old name
      courseTypeName: data.courseTypeName.trim(),
      description: data.description,
      instructorId: data.instructorId,
      totalSessions: data.totalSessions,
      courseFee: data.courseFee,
      days: data.days,
      coverImage: data.coverImage, // optional new cover
    });

    // if a new cover was uploaded we could optimistically clear preview
    reset({ ...data, coverImage: undefined });
    onCloseModal?.();
    router.refresh();
  };

  if (loading) {
    return (
      <div className="w-[min(100%,36rem)] p-4 text-sm text-slate-500">
        Loading course…
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[min(100%,36rem)] p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!course) return null;

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="space-y-1 w-[min(100%,36rem)] grid grid-cols-2 gap-x-10"
    >
      {/* Course Type */}
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
          rows={4}
          placeholder="Briefly describe the course..."
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
          defaultValue=""
          className="w-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-500"
          {...register("instructorId", { valueAsNumber: true })}
        >
          <option value="" disabled>
            Select an instructor
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
          {...register("courseFee", { valueAsNumber: true })}
        />
        {errors.courseFee && (
          <p className="text-xs text-red-600">
            {errors.courseFee.message as string}
          </p>
        )}
      </div>

      {/* Days */}
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

      {/* Cover Image (current + new) */}
      <div className="space-y-2">
        <label
          htmlFor="coverImage"
          className="text-sm font-medium text-slate-700"
        >
          Cover Image
        </label>

        {currentCoverKey ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/storage/image?key=${encodeURIComponent(currentCoverKey)}`}
            alt="Current cover"
            className="mb-2 h-[3rem] w-full max-w-[3rem] rounded-md border border-slate-200 object-cover"
          />
        ) : null}

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

        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="New cover preview"
            className="mt-2 h-[2rem] w-full max-w-[2rem] rounded-md border border-slate-200 object-cover"
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 col-span-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            // reset back to current fetched values
            if (course) {
              reset({
                id: course.id,
                courseTypeName: course.courseType?.name ?? "",
                description: course.description ?? "",
                instructorId: course.instructorId,
                courseFee: course.courseFee,
                days: Array.isArray(course.courseDay)
                  ? course.courseDay.map((d: { day: Day }) => d.day)
                  : [],
                coverImage: undefined,
              });
            }
            onCloseModal?.();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || saving}>
          {isSubmitting || saving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
