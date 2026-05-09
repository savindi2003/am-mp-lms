"use client";

import React from "react";
import { format } from "date-fns";
import { formatCurrency } from "@/modules/shared/utils/helper";

export type DueExpireItem = {
  nic: string;
  name: string; // e.g., "First Last"
  dueAmount: number; // in LKR
  dueDate: string; // ISO string
  enrollmentNumber: string;
};

export default function DueExpiresChart({ items }: { items: DueExpireItem[] }) {
  if (!items?.length) {
    return (
      <div className="rounded-sm px-5 py-3 bg-slate-200">
        <h2 className="text-xl font-medium text-slate-700">Due Expires</h2>
        <p className="mt-2 text-sm text-slate-500">No overdue enrollments.</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl bg-slate-200 px-5 py-3 w-xl">
      <h2 className="text-xl font-medium text-slate-700">Due Expires</h2>

      <div className="my-5 h-80 overflow-y-auto">
        {items.map((item, i) => (
          <div className="grid grid-cols-[1fr_0.7fr_1fr] my-4" key={i}>
            <div className="flex flex-col">
              <p>{item.name}</p>
              <p>{item.nic}</p>
              <p className="bg-slate-500 text-sm w-fit px-1 text-slate-50">
                {item.enrollmentNumber}
              </p>
            </div>
            <div>
              <p className="bg-red-500 text-red-50 px-1 w-fit">
                {formatCurrency(item.dueAmount)}
              </p>
            </div>
            <div>
              <p>{format(new Date(item.dueDate), "dd MMM yy hh:mm a")}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3"></div>
    </div>
  );
}
