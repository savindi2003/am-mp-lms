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
      <div className="flex gap-3">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 text-sm"
        />

        <input
          placeholder="Class Type"
          value={classType}
          onChange={(e) => setClassType(e.target.value)}
          className="border p-2 text-sm"
        />
      </div>

      {/* table */}
      <div className="overflow-x-auto border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Class Type</th>
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