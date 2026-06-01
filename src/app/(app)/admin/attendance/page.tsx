

"use client";

import { useState } from "react";
import AttendanceFilters from "@/modules/admin/attendance/components/AttendanceFilters";
import AttendanceTable from "@/modules/admin/attendance/components/AttendanceTable";
import {
  getFilters,
  getStudents,
  saveAttendance,
} from "@/modules/admin/attendance/services/apiAttrndance";
import { Button } from "@/modules/ui/button";
import toast from "react-hot-toast";


export default function Page() {
  const [filters, setFilters] = useState<any>({});
  const [options, setOptions] = useState<any>({
    classTypes: [],
    classes: [],
    lectures: [],
  });

  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving , setSaving] = useState(false);

  // load dropdowns
  useState(() => {
    getFilters().then(setOptions);
  });

  
  const loadStudents = async () => {
    setLoading(true);
    if (!filters.classId || !filters.lectureId) {
      toast.error("Select all filters");
      setLoading(false);
      return;
    }

    const data = await getStudents({
      classId: filters.classId,
      lectureId: filters.lectureId,
    });
     
    setLoading(false);
    setStudents(data);
  };

  // SAVE
  const handleSave = async () => {
    setSaving(true);
    await saveAttendance({
      lectureId: filters.lectureId,
      classId: filters.classId,
      data: students,
    });

    setSaving(false);
    toast.success("Attendance saved successfully!")
  };

  const handleClearAll = () => {
  //reload
};

  // SAFE SEARCH
  const filteredStudents = students.filter((s) => {
    const q = search.toLowerCase();

    return (
      (s.name || "").toLowerCase().includes(q) ||
      (s.userId || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-5 space-y-4">

      <AttendanceFilters
        filters={filters}
        setFilters={setFilters}
        options={options}
        onClick={loadStudents}
        loading={loading}
      />

      
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-3 ">

        

      {students.length > 0 && (
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or NIC"
          className="input w-full md:w-80 text-sm justify-end"
        />
      )}

      </div>
      
      <AttendanceTable
        students={filteredStudents}
        setStudents={setStudents}
        loading={loading}
      />

      {students.length > 0 && (
            <Button onClick={handleSave} >
              {saving ? "Loading..." : "Save Attendance"}
            </Button>
      )}

      {(students.length > 0 || Object.keys(filters).length > 0) && (
        <Button
          variant="secondary" className="mx-2"
          onClick={handleClearAll}
        >
          Clear
        </Button>
      )}
    </div>
  );
}