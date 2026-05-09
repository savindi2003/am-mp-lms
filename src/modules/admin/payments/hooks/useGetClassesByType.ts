"use client";

import { useEffect, useState } from "react";

export function useGetClassesByType(classTypeId: number | null) {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!classTypeId) return;

    const fetchClasses = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `/api/backend/admin/classes?classTypeId=${classTypeId}`
        );
        const data = await res.json();
        setClasses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [classTypeId]);

  return { classes, loading };
}