// src/modules/instructor/classes/hooks/useGetClassEnrollments.ts

"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ClassEnrollment } from "../types/typeClassEnrollment";
import { getClassEnrollments } from "../services/apiClassEnrollment";

export function useGetClassEnrollments(classId: number, page: number) {
  const [enrollments, setEnrollments] = useState<ClassEnrollment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!classId) return;

    setLoading(true);
    try {
      const data = await getClassEnrollments(classId, page);
      setEnrollments(data.enrollments);
      setTotal(data.total);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [classId, page]);

  return { enrollments, total, loading, refetch: load };
}