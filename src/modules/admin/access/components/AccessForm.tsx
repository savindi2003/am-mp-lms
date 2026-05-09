"use client";

import { useEffect, useState } from "react";
import {
  searchStudents,
  getEnrollments,
  createAccess,
} from "../services/apiAccessControl";
import { Button } from "@/modules/ui/button";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AccessForm({ onSuccess }: any) {
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState<any>(null);

  const [month, setMonth] = useState("");
  const [reason, setReason] = useState("");

  

  //  search students
  useEffect(() => {
    if (query.length < 2) {
      setStudents([]);
      return;
    }
    searchStudents(query).then(setStudents);
  }, [query]);

  //  load enrollments
  useEffect(() => {
    if (!selectedStudent) return;
    getEnrollments(selectedStudent.id).then(setEnrollments);
  }, [selectedStudent]);

  const handleSubmit = async () => {
    if (!selectedStudent || !selectedEnrollment || !month) {
      toast.error("Fill all required fields");
      return;
    }

    await createAccess({
      enrollmentId: selectedEnrollment.id,
      studentId: selectedStudent.id,
      classId: selectedEnrollment.classId,
      month,
      reason,
    });

    
    toast.success("Access granted");
    onSuccess();

    // reset
    setSelectedStudent(null);
    setSelectedEnrollment(null);
    setQuery("");
    setMonth("");
    setReason("");
  };

  return (
    <div className="bg-slate-200 p-5 space-y-4">

      {/*  STUDENT SEARCH */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Search Student
        </label>

        <input
          placeholder="Type name or NIC..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input w-full sm:w-md"
        />

        {/* dropdown results */}
        {students.length > 0 && !selectedStudent && (
          <div className="mt-2 max-h-40 overflow-y-auto bg-white w-full sm:w-md">
            {students.map((s) => (
              <div
                key={s.id}
                onClick={() => {
                  setSelectedStudent(s);
                  setStudents([]);
                }}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm w-full sm:w-md"
              >
                {s.firstName} {s.lastName} ({s.user.NIC})
              </div>
            ))}
          </div>
        )}
      </div>

      {/*  SELECTED STUDENT */}
      {selectedStudent && (
        <div className="border p-3 bg-white text-sm flex justify-between w-full sm:w-md">
          <span>
            👤 {selectedStudent.firstName} {selectedStudent.lastName}
          </span>
          <button
            onClick={() => {
              setSelectedStudent(null);
              setSelectedEnrollment(null);
            }}
            className="text-red-500 text-xs"
          >
            Change
          </button>
        </div>
      )}

      {/*  ENROLLMENTS */}
      {selectedStudent && (
        <div>
          <label className="block text-sm font-semibold mb-2">
            Select Class
          </label>

          <div className="grid gap-2">
            {enrollments.map((e) => (
              <div
                key={e.id}
                onClick={() => setSelectedEnrollment(e)}
                className={cn(
                  "bg-white p-3 cursor-pointer text-sm w-full sm:w-md ",
                  selectedEnrollment?.id === e.id
                    ? " border-2 border-black"
                    : "hover:bg-gray-100"
                )}
              >
                <div className="font-medium">
                  {e.class.classType.name}
                </div>

                <div className="text-xs text-gray-500">
                  {e.class.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/*  MONTH */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Access Month
        </label>

        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="input w-full sm:w-md"
        />
      </div>

      {/*  REASON */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Reason
        </label>

        <textarea
          placeholder="Enter reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="input w-full sm:w-md"
        />
      </div>

      {/*  SUBMIT */}
      <Button onClick={handleSubmit} className="w-full sm:w-auto">
        Grant Access
      </Button>
    </div>
  );
}

