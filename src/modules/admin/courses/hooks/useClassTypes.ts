"use client";

import { useEffect, useState } from "react";

export function useClassTypes() {
  const [types, setTypes] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/backend/admin/class-types", {
          cache: "no-store",
        });

        const data = await res.json();
        setTypes(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { types, loading };
}