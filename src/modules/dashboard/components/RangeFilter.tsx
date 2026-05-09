"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const OPTIONS = [0,7, 30, 90] as const;

export default function RangeFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const current = Number(searchParams.get("last") ?? "7");
  const toastId = useRef("");
  useEffect(() => {
    if (!toastId.current) return;
    setLoading(false);
    toast.success("stats updated!", { id: toastId.current });
  }, [current]);

  const isActive = (d: number) =>
    current === d
      ? "bg-slate-600 text-slate-50"
      : "bg-slate-100 text-slate-700 disabled:bg-slate-200";

  function setRange(days: number) {
    setLoading(true);
    toastId.current = toast.loading("Loading...");
    try {
      const params = new URLSearchParams(searchParams?.toString());
      params.set("last", String(days));
      router.replace(`${pathname}?${params.toString()}`);
    } catch (err) {
      toast.error("fetching data failed!", { id: toastId.current });
      setLoading(false);
    }
  }

  return (
    <div className="mb-4 flex gap-2 ml-auto w-fit">
      {OPTIONS.map((d, i) => (
        <button
          key={i}
          onClick={() => setRange(d)}
          disabled={loading}
          className={`rounded-sm px-3 py-1 text-sm cursor-pointer ${isActive(d)}`}
        >
           {d === 0 ? "Today" : `Last ${d}d`}
        </button>
      ))}
    </div>
  );
}
