"use client";

import { useEffect, useState } from "react";

export function dentNICs() {
  const [NICs, setNICs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/backend/admin/students/get-NICs")
      .then((res) => res.json())
      .then(setNICs);
  }, []);

  return { NICs };
}