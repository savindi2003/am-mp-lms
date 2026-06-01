"use client";

import { useMemo, useState } from "react";
import AccountTableRow from "./AccountTableRow";

export default function AccountTableView({
  users,
}: {
  users: any[];
}) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const first =
        u.student?.firstName ??
        u.admin?.firstName ??
        "";

      const last =
        u.student?.lastName ??
        u.admin?.lastName ??
        "";

      const fullName =
        `${first} ${last}`.toLowerCase();

      const matchSearch =
        fullName.includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());

      const matchRole =
        role === "ALL" ? true : u.role === role;

      return matchSearch && matchRole;
    });
  }, [users, search, role]);

  return (
    <div className="space-y-4">
      {/* FILTERS */}
      <div className="flex gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">Student Email</label>
          <input
            className="border p-2 text-sm"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>


        <div className="flex gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">User Role</label>
            <select
              className="border p-2 text-sm"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="ADMIN">ADMIN</option>
              <option value="INSTRUCTOR">INSTRUCTOR</option>
              <option value="STUDENT">STUDENT</option>
            </select>
          </div>
        </div>
        </div>

        {/* TABLE */}
        <div className="border  bg-white">
          {/* HEADER */}
          <table className="w-full text-sm sm:overflow-x-auto">
            <thead className="px-4 py-2 text-sm font-bold bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">NIC</th>
                <th className="p-3 text-left">Contact</th>
                <th className="p-3 text-left">Created</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
          </table>

          {/* BODY (SCROLLABLE) */}
          <div className="max-h-125 overflow-y-auto bg-white">
            <table className="w-full text-sm">
              <tbody>
                {filtered.map((user) => (
                  <AccountTableRow
                    key={user.id}
                    user={user}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      );
}