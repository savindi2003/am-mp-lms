"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  createCourse as createCourseApi,
  type CreateCourseApiPayload,
} from "@/modules/admin/courses/services/apiCourse";

export function useCreateCourse() {
  const [loading, setLoading] = useState(false);

  async function createCourse(payload: CreateCourseApiPayload) {
    setLoading(true);
    console.log(payload);
    try {
      const data = await createCourseApi(payload, true);
      toast.success("Course created");
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to create Course");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { loading, createCourse };
}
