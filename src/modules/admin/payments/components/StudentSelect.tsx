"use client";

import { useState, useMemo, useRef, useEffect } from "react";

export default function StudentSelect({ students, onSelect }: any) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  //  FILTER ONLY WHEN USER TYPES
  const filtered = useMemo(() => {
    if (!query.trim()) return [];

    return students
      .filter((s: any) =>
        `${s.firstName} ${s.lastName} ${s.user?.userId}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
      .slice(0, 10); // limit results (performance)
  }, [query, students]);

  
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      
      {/* INPUT */}
      <input
        placeholder="Type student name or NIC..."
        className="border p-2 w-full text-sm px-3"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-50 w-full bg-white border mt-1 shadow max-h-60 overflow-y-auto">
          {/* EMPTY STATE */}
          {query && filtered.length === 0 && (
            <div className="p-2 text-sm text-gray-500">
              No students found
            </div>
          )}

          {/* RESULTS */}
          {filtered.map((s: any) => (
            <div
              key={s.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(s);
                setQuery(`${s.firstName} ${s.lastName} - ${s.user?.userId}`);
                setOpen(false);
              }}
            >
              <div className="font-sm text-sm">
                {s.firstName} {s.lastName}
              </div>
              <div className="text-xs text-gray-500">{s.user?.userId}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}