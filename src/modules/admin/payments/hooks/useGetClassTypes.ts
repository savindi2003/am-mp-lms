"use client";

import { useEffect, useState } from "react";

export function useGetClassTypes() {
  const [classTypes, setClassTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch("/api/backend/admin/class-types");
        const data = await res.json();
        setClassTypes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
  }, []);

  return { classTypes, loading };
}