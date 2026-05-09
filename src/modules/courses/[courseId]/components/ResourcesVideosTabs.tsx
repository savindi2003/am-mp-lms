"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function ResourcesVideosTabs({
  selected,
}: {
  selected: "resources" | "videos";
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hrefFor = (tab: "resources" | "videos") => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("tab", tab);
    return `${pathname}?${sp.toString()}`;
  };

  const base =
    "inline-block px-4 py-2 border-b-2 -mb-px text-sm sm:text-base transition-colors";
  const inactive =
    "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300";
  const active = "border-slate-900 text-slate-900";

  return (
    <div className="mt-6 border-b border-slate-200">
      <nav className="flex gap-4" role="tablist" aria-label="Course tabs">
        <Link
          href={hrefFor("resources")}
          className={`${base} ${selected === "resources" ? active : inactive}`}
          role="tab"
          aria-selected={selected === "resources"}
        >
          Resources
        </Link>
        <Link
          href={hrefFor("videos")}
          className={`${base} ${selected === "videos" ? active : inactive}`}
          role="tab"
          aria-selected={selected === "videos"}
        >
          Course Videos
        </Link>
      </nav>
    </div>
  );
}
