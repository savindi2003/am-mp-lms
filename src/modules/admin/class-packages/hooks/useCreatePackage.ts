"use client";

import toast from "react-hot-toast";
import { useState } from "react";

export function useCreatePackage() {
  const [loading, setLoading] = useState(false);

  async function createPackage(data: any) {
    try {
      setLoading(true);

      const res = await fetch(
        "/api/backend/admin/class-packages",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error);
      }

      toast.success("Package created");

      return true;
    } catch (err: any) {
      toast.error(err.message);

      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    createPackage,
  };
}