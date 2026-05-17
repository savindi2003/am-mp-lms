

"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useGetEnrollments(page: number, query: string) {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const getEnrollments = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/backend/admin/enrollments?${query}`
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setEnrollments(data.enrollments);
      setTotal(data.total);
    } catch (err: any) {
      toast.error(err.message || "Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEnrollments();
  }, [query]);

  return {
    enrollments,
    loading,
    total,
    getEnrollments,
  };
}