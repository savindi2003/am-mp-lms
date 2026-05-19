"use client";

import { Button } from "@/modules/ui/button";

export default function PackageCard({
  pkg,
  onEdit,
  onDelete,
}: any) {
  return (
    <div className="border rounded-2xl p-5 bg-white shadow-sm space-y-4">

      <div>
        <h2 className="font-semibold text-lg">
          {pkg.name}
        </h2>

        <p className="text-green-600 font-medium">
          Rs. {pkg.totalFee}
        </p>
      </div>

      <div className="space-y-1">
        {pkg.items.map((item: any) => (
          <div
            key={item.id}
            className="text-sm text-slate-600"
          >
            • {item.class.classType.name}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => onEdit(pkg)}
        >
          Edit Price
        </Button>

        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(pkg.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}