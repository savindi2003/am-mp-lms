"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const OPTIONS = [
  { label: "Today", value: 0 },
  { label: "This Week", value: 7 },
  { label: "This Month", value: 30 },
  { label: "Last 3 Months", value: 90 },
] as const;

export default function RangeFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const toastId = useRef("");

  const current = Number(searchParams.get("last") ?? "7");

  useEffect(() => {
    if (!toastId.current) return;
    setLoading(false);
    toast.success("Stats updated!", { id: toastId.current });
  }, [current]);

  function setRange(days: number) {
    setLoading(true);
    toastId.current = toast.loading("Loading...");

    const params = new URLSearchParams(searchParams.toString());
    params.set("last", String(days));

    router.replace(`${pathname}?${params.toString()}`);
  }

  const isActive = (v: number) =>
    current === v
      ? "bg-slate-600 text-white"
      : "bg-slate-100 text-slate-700";

  return (
    <div className="mb-4 flex gap-2 ml-auto w-fit">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setRange(opt.value)}
          disabled={loading}
          className={`rounded-sm px-3 py-1 text-sm ${isActive(opt.value)}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}