"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateYoutubeLinkFormData,
  createYoutubeLinkSchema,
} from "../validators/createYoutubeLinkSchema";
import { Button } from "@/modules/ui/button";

export function AddYoutubeLinkForm({
  onCreate,
}: {
  onCreate: (d: CreateYoutubeLinkFormData) => Promise<void>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateYoutubeLinkFormData>({
    resolver: zodResolver(createYoutubeLinkSchema),
    defaultValues: { title: "", description: "", link: "" ,month: ""},
  });

  async function onSubmit(data: CreateYoutubeLinkFormData) {
    setSubmitting(true);
    try {
      await onCreate({ ...data, description: data.description || undefined });
      reset();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 space-y-3 bg-slate-200"
    >
      <div className="grid gap-2">
        <label className="text-sm font-medium">Title</label>
        <input {...register("title")} className="xl:max-w-md input" />
        {errors.title && (
          <p className="text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Description (optional)</label>
        <textarea
          {...register("description")}
          rows={3}
          className="input xl:max-w-md"
        />
        {errors.description && (
          <p className="text-xs text-red-600">{errors.description.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">YouTube Link</label>
        <input
          {...register("link")}
          placeholder="Paste the full YouTube link"
          className="xl:max-w-md input"
        />
        {errors.link && (
          <p className="text-xs text-red-600">{errors.link.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Access Month</label>
        <input
           type="month"
          {...register("month")}
          className="xl:max-w-md input"
        />
        {errors.month && (
          <p className="text-xs text-red-600">{errors.month.message}</p>
        )}
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Adding…" : "Add link"}
      </Button>
    </form>
  );
}
