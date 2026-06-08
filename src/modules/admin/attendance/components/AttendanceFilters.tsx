"use client";

import { useEffect, useState } from "react";
import {
  getClasses,
  getLectures,
} from "../services/apiAttrndance";
import { Button } from "@/modules/ui/button";

export default function AttendanceFilters({
  filters,
  setFilters,
  options,
  onClick,
  loading,
}: any) {
  const [classes, setClasses] = useState<any[]>([]);
  const [lectures, setLectures] = useState<any[]>([]);

  //  LOAD CLASSES WHEN GRADE CHANGE
  useEffect(() => {
    if (!filters.classTypeId) return;

    getClasses(filters.classTypeId).then(setClasses);
  }, [filters.classTypeId]);

  //  LOAD LECTURES WHEN CLASS + DATE CHANGE
  useEffect(() => {
    if (!filters.classId || !filters.date) return;

    getLectures(filters.classId, filters.date).then(setLectures);
  }, [filters.classId, filters.date]);

  return (
    <div className="grid md:grid-cols-5 gap-3 bg-white">

      {/* GRADE */}
      <select
        className="input"
        onChange={(e) =>
          setFilters({
            ...filters,
            classTypeId: Number(e.target.value),
            classId: "",
            lectureId: "",
          })
        }
      >
        <option>Select Grade</option>
        {options.classTypes.map((c: any) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {/* CLASS */}
      <select
        className="input"
        onChange={(e) =>
          setFilters({
            ...filters,
            classId: Number(e.target.value),
            lectureId: "",
          })
        }
      >
        <option>Select Class</option>
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.description}
          </option>
        ))}
      </select>

      {/* DATE */}
      <input
        type="date"
        className="input w-full"
        onChange={(e) =>
          setFilters({
            ...filters,
            date: e.target.value,
            lectureId: "",
          })
        }
      />

      {/* LECTURE */}
      <select
        className="input"
        onChange={(e) =>
          setFilters({
            ...filters,
            lectureId: e.target.value,
          })
        }
      >
        <option>Select Lecture</option>
        {lectures.map((l) => (
          <option key={l.id} value={l.id}>
            {l.title}
          </option>
        ))}
      </select>

      <Button
        onClick={onClick} disabled={loading}
        
      >
         {loading ? "Loading..." : "Load Students"}
      </Button>
    </div>
  );
}

