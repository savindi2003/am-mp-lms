"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  updateCourse as updateCourseApi,
  type UpdateCourseApiPayload,
} from "@/modules/admin/courses/services/apiCourse";

export function useUpdateCourse() {
  const [loading, setLoading] = useState(false);

  async function updateCourse(payload: UpdateCourseApiPayload) {
    setLoading(true);
    try {
      const data = await updateCourseApi(payload);
      toast.success("Course updated");
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to update Course");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { loading, updateCourse };
}
