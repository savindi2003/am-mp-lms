"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Role } from "@prisma/client";

type Props = {
  userTypes: Role[];
  selectedRole?: Role;
  disabled?: boolean;
};

export default function AccountFilter({
  userTypes,
  selectedRole,
  disabled,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const options = useMemo(
    () => Array.from(new Set(userTypes)).sort(),
    [userTypes],
  );

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams?.toString());
    if (value) params.set("role", value);
    else params.delete("role");
    params.set("page", String(1));
    router.replace(`${pathname}${params.toString() ? `?${params}` : ""}`);
  }

  // const label = (r: string) =>
  //   r

  return (
    <label className="flex items-center gap-2 text-sm my-5">
      <span className="text-slate-700">Role</span>
      <select
        className="rounded-sm border px-3 py-2"
        value={selectedRole ?? ""}
        onChange={(e) => handleChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">All</option>
        {options.map((r) => (
          <option key={r} value={r}>
            {r.toLowerCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
