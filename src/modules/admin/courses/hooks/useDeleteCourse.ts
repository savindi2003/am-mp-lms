"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { deleteCourse as deleteCourseApi } from "@/modules/admin/courses/services/apiCourse";

export function useDeleteCourse() {
  const [loading, setLoading] = useState(false);

  async function deleteCourse(courseId: number) {
    setLoading(true);
    try {
      const data = await deleteCourseApi(courseId);
      toast.success("Course deleted");
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to delete Course");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { loading, deleteCourse };
}
