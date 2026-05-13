"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/modules/ui/button";
import { useUploadCourseResource } from "@/modules/admin/resources/hooks/useUploadCourseResource";
import {
  uploadResourceFormData,
  uploadResourceSchema,
} from "@/modules/admin/resources/validators/uploadResourceSchema";

type Props = {
  courseId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUploaded?: (res: any) => void; // optional callback after success
  onGetCourseResources: () => Promise<void>;
};


// build schema inside the client component to avoid SSR pitfalls

export default function UploadResourceForm({
  courseId,
  onUploaded,
  onGetCourseResources,
}: Props) {
  const { uploadAndSave, loading } = useUploadCourseResource(courseId);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<uploadResourceFormData>({
    resolver: zodResolver(uploadResourceSchema),
    mode: "onBlur",
    defaultValues: { title: "" },
  });

  const accept =
    "image/*,application/pdf,application/zip,application/msword," +
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document," +
    "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet," +
    "application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation";

  async function onSubmit(values: uploadResourceFormData) {
    setError(null);
    const file: File = values.file[0]; // guaranteed by schema refine
    try {
      const res = await uploadAndSave(file, {
        title: values.title,
        month: values.month,
      });
      onUploaded?.(res);
      // reset title; to clear file input, reset entire form (keeps it simple)
      reset({ title: "" });
      await onGetCourseResources();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e?.message ?? "Upload failed");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 bg-slate-200 p-4"
    >
      <div>
        <label className="block text-sm font-medium text-slate-800 mb-1">
          Title
        </label>
        <input
          {...register("title")}
          type="text"
          placeholder="e.g., Syllabus.pdf"
          className="input sm:w-md"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-800 mb-1">
          Access Month
        </label>
        <input
          {...register("month")}
          type="month"
          className="input sm:w-md"
        />
        {errors.month && (
          <p className="mt-1 text-xs text-red-600">{errors.month.message}</p>
        )}
      </div>



      <div>
        <label className="block text-sm font-medium text-slate-800 mb-1">
          File{" "}
        </label>
        <input
          {...register("file")}
          type="file"
          accept={accept}
          className="w-full file:text-sm text-xs file:bg-slate-600 file:text-slate-50 file:px-2 file:cursor-pointer"
        />
        {errors.file && (
          <p className="mt-1 text-xs text-red-600">
            {String(errors.file.message)}
          </p>
        )}
        <p className="mt-1 text-[11px] text-slate-500">
          <strong className="font-semibold">Allowed:</strong> images, PDF,
          DOC/DOCX, XLS/XLSX, PPT/PPTX, ZIP. Max 50MB.
        </p>
      </div>

      <div className="flex gap-3">
        <Button disabled={loading}>{loading ? "Uploading…" : "Upload"}</Button>
      </div>
    </form>
  );
}
