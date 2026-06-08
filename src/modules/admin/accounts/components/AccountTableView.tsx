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
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 sm:w-full md:w-2/3 lg:w-2/3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">
            Student Email
          </label>
          <input
            className="border p-2 text-sm"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-700">
            User Role
          </label>
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

      <div className="border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="sticky top-0 z-10 bg-gray-100">
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
      </div>
      );
}