import { useEffect, useState } from "react";

export function useGetClasses() {
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/backend/admin/classes")
      .then((res) => res.json())
      .then(setClasses)
      .catch(() => setClasses([]));
  }, []);

  return { classes };
}