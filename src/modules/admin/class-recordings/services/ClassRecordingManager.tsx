"use client";

import { Button } from "@/modules/ui/button";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export function ClassRecordingManager({ courseId }: any) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [month, setMonth] = useState("");
  const [list, setList] = useState([]);

  async function load() {
    const res = await fetch(
      `/api/backend/admin/courses/${courseId}/recordings`
    );
    setList(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit() {
    const res = await fetch(
      `/api/backend/admin/courses/${courseId}/recordings`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, link, month , courseId}),
      }
    );

    if (!res.ok) return toast.error("Failed");

    toast.success("Uploaded");
    setTitle("");
    setLink("");
    setMonth("");
    load();
  }

  return (
    <div className="bg-slate-200 p-5 space-y-4">

      <div>
        <label className="block text-sm font-medium mb-1">Lecture Title</label>
        <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input w-full sm:w-md"
      />
      </div>
      
  <div>
        <label className="block text-sm font-medium mb-1">Google Drive Link</label>
      <input
        placeholder="Google Drive Link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        className="input w-full sm:w-md"
      />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Access Month</label>
        
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="input w-full sm:w-md"
      />
      </div>

      <Button onClick={handleSubmit} className="w-full sm:w-auto">
        Upload Recording
      </Button>

      {/* LIST */}
      <div className="mt-6 space-y-2">
        {list.map((r: any) => (
          <a
            key={r.id}
            href={r.link}
            target="_blank"
            className="block p-2 border"
          >
            📹 {r.title}
          </a>
        ))}
      </div>
    </div>
  );
}