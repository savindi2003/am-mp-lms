"use client";

import { useState } from "react";
import PaymentRow from "./PaymentRow";

export default function StudentPaymentTable({
  initialRows,
}: {
  initialRows: any[];
}) {
  const [rows] = useState(initialRows);
  const [month, setMonth] = useState("");
  const [classType, setClassType] = useState("");

  const filtered = rows.filter((r) => {
    return (
      (!month || r.month === month) &&
      (!classType || r.classTypeName === classType)
    );
  });

  return (
    <div className="space-y-4">
      {/* filters */}
      <div className="flex flex-col gap-3">
        <label htmlFor="classType" className="text-xs font-medium text-slate-700">
          Select month
        </label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 text-sm w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
        />

        
      </div>

      {/* table */}
      <div className="overflow-x-auto border bg-white">
        <table className="w-full sm:text-xs text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Grade</th>
              <th className="p-3">Description</th>
              <th className="p-3">Enrollment ID</th>
              <th className="p-3">Month</th>
              <th className="p-3">Paid Amount</th>
              <th className="p-3">Paid Date</th>
              <th className="p-3">Receipt</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((row, i) => (
              <PaymentRow key={i} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}