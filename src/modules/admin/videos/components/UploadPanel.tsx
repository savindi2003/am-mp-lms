"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCourseVideoFormData,
  createCourseVideoSchema,
} from "@/modules/admin/videos/validators/createCourseVideoSchema";

type Props = {
  onUpload: (
    file: File,
    opts: { title?: string; description?: string },
  ) => Promise<void>;
};

export function UploadPanel({ onUpload }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCourseVideoFormData>({
    resolver: zodResolver(createCourseVideoSchema),
    defaultValues: { title: "", description: "" },
  });

  async function onSubmit(data: CreateCourseVideoFormData) {
    const file = data.file.item(0)!;
    setSubmitting(true);
    try {
      await onUpload(file, {
        title: data.title,
        description: data.description || undefined,
      });
      reset(); // clear fields after successful upload
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl border p-4 space-y-3"
    >
      <div className="grid gap-2">
        <label className="text-sm font-medium">Title *</label>
        <input
          {...register("title")}
          type="text"
          placeholder="e.g. Introduction to Module 1"
          className="w-full rounded-md border px-3 py-2 text-sm"
          aria-invalid={!!errors.title}
        />
        {errors.title && (
          <p className="text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Description (optional)</label>
        <textarea
          {...register("description")}
          rows={3}
          placeholder="Short summary of the lesson"
          className="w-full rounded-md border px-3 py-2 text-sm"
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p className="text-xs text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Video file</label>
        <input
          {...register("file")}
          type="file"
          accept="video/*"
          className="text-sm"
          aria-invalid={!!errors.file}
        />
        {errors.file && (
          <p className="text-xs text-red-600">
            {errors.file.message as string}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="rounded-md bg-primary px-3 py-2 text-white disabled:opacity-50"
        disabled={submitting}
      >
        {submitting ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}
