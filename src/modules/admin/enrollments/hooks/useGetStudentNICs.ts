"use client";

import { useEffect, useState } from "react";

export function useGetStudentNICs() {
  const [NICs, setNICs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/backend/admin/students/get-NICs")
      .then((res) => res.json())
      .then(setNICs);
  }, []);

  return { NICs };
}