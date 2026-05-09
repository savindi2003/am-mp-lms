"use client";

import { useEffect, useState } from "react";

export function useGetPackages(classTypeId: number | null) {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!classTypeId) return;

    const fetchPackages = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `/api/backend/admin/packages?classTypeId=${classTypeId}`
        );
        const data = await res.json();
        setPackages(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [classTypeId]);

  return { packages, loading };
}