"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useGetClassTypes } from "../../payments/hooks/useGetClassTypes";
import { useGetClassesByType } from "../../payments/hooks/useGetClassesByType";

export default function Filters() {
  const router = useRouter();
  const params = useSearchParams();

  const classTypeId = Number(params.get("classTypeId") || 0);

  const { classTypes } = useGetClassTypes();
  const { classes } = useGetClassesByType(classTypeId);

  function updateParam(key: string, value: string) {
    const newParams = new URLSearchParams(params.toString());

    if (!value) newParams.delete(key);
    else newParams.set(key, value);

    router.push(`?${newParams.toString()}`);
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">

      {/*  SEARCH */}
      <input
        placeholder="Search name / NIC"
        className="border px-3 py-2 text-sm"
        onChange={(e) => updateParam("search", e.target.value)}
      />

      {/*  MONTH */}
      <input
        type="month"
        className="border px-3 py-2 text-sm"
        onChange={(e) => updateParam("month", e.target.value)}
      />

      {/*  PAID */}
      <select
        className="border px-3 py-2 text-sm"
        onChange={(e) => updateParam("paid", e.target.value)}
      >
        <option value="">All</option>
        <option value="paid">Paid</option>
        <option value="unpaid">Unpaid</option>
      </select>

      {/*  CLASS TYPE */}
      <select
        className="border px-3 py-2 text-sm"
        onChange={(e) => updateParam("classTypeId", e.target.value)}
      >
        <option value="">All Grades</option>
        {classTypes.map((t: any) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      {/*  CLASS */}
      <select
        className="border px-3 py-2 text-sm"
        onChange={(e) => updateParam("classId", e.target.value)}
      >
        <option value="">All Classes</option>
        {classes.map((c: any) => (
          <option key={c.id} value={c.id}>
            {c.description}
          </option>
        ))}
      </select>
    </div>
  );
}