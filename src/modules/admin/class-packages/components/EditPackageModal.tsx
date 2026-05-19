"use client";

import { useState } from "react";
import { Button } from "@/modules/ui/button";
import toast from "react-hot-toast";

export default function EditPackageModal({
  pkg,
  onSuccess,
}: any) {

  const [price, setPrice] = useState(pkg.totalFee);
  const [loading, setLoading] = useState(false);

  async function handleUpdate() {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/backend/admin/class-packages/${pkg.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            totalFee: price,
          }),
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Package updated");
      onSuccess?.();

    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border p-4 rounded-xl space-y-3">

      <p className="font-semibold">
        Edit Package Price
      </p>

      <input
        type="number"
        value={price}
        onChange={(e) =>
          setPrice(e.target.value)
        }
        className="border p-2 w-full rounded"
      />

      <Button
        onClick={handleUpdate}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update"}
      </Button>

    </div>
  );
}