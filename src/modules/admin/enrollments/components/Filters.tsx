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

  const inputStyle = "border px-3 py-2 text-sm w-full";

  const labelStyle = "text-xs font-medium text-slate-800 mb-1";

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">

      {/* SEARCH */}
      <div className="flex flex-col">
        <label className={labelStyle}>Search (Name / ID)</label>
        <input
          placeholder="Search..."
          className={inputStyle}
          onChange={(e) => updateParam("search", e.target.value)}
        />
      </div>

      {/* MONTH */}
      <div className="flex flex-col">
        <label className={labelStyle}>Active Month</label>
        <input
          type="month"
          className={inputStyle}
          onChange={(e) => updateParam("month", e.target.value)}
        />
      </div>

      {/* PAID */}
      <div className="flex flex-col">
        <label className={labelStyle}>Payment Status</label>
        <select
          className={inputStyle}
          onChange={(e) => updateParam("paid", e.target.value)}
        >
          <option value="">All</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      {/* STATUS */}
<div className="flex flex-col">
  <label className={labelStyle}>Enrollment Status</label>

  <select
    className={inputStyle}
    onChange={(e) => updateParam("status", e.target.value)}
  >
    <option value="">All Status</option>
    <option value="ACTIVE">ACTIVE</option>
    <option value="COMPLETED">COMPLETED</option>
    <option value="DROPPED">DROPPED</option>
    <option value="TRANSFERRED">TRANSFERRED</option>
  </select>
</div>

      {/* CLASS TYPE */}
      <div className="flex flex-col">
        <label className={labelStyle}>Class Type</label>
        <select
          className={inputStyle}
          onChange={(e) => updateParam("classTypeId", e.target.value)}
        >
          <option value="">All Grades</option>
          {classTypes.map((t: any) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* CLASS */}
      <div className="flex flex-col">
        <label className={labelStyle}>Class</label>
        <select
          className={inputStyle}
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

    </div>
  );
}