"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { updateCourseCurrentWeekByEnrollmentId as updateCourseWeekApi } from "@/modules/shared/attendances/services/apiAttendance";

type Options = {
  onSuccess?: () => void;
  maxWeek?: number;
};

export function useUpdateCourseWeek(enrollmentId: number, opts?: Options) {
  const [loading, setLoading] = useState(false);

  async function updateCourseWeek(week: number | string) {
    const currentWeek = typeof week === "string" ? parseInt(week, 10) : week;

    if (!Number.isFinite(currentWeek) || currentWeek <= 0) {
      toast.error("Select a valid week");
      return;
    }
    if (opts?.maxWeek && currentWeek > opts.maxWeek) {
      toast.error(`Week cannot exceed ${opts.maxWeek}`);
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating course week...");
    try {
      await updateCourseWeekApi(enrollmentId, { currentWeek });
      toast.success("Current week updated", { id: toastId });
      opts?.onSuccess?.();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to update course week", {
        id: toastId,
      });
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { loading, updateCourseWeek };
}
