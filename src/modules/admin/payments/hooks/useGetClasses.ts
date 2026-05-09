import { useEffect, useState } from "react";

export function useGetClasses() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetch("/api/backend/admin/classes")
      .then((res) => res.json())
      .then((data) => {
        const safe = data.map((c: any) => ({
          ...c,
          classFee: Number(c.classFee ?? 0),
        }));

        setClasses(safe);
      });
  }, []);

  return { classes };
}