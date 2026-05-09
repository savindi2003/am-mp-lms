"use client";

import { useState } from "react";
import toast from "react-hot-toast";


export function useCreateClass() {

  const [loading, setLoading] = useState(false);

  
  async function handleCreate(data: any) {
    setLoading(true);

    try {
      const res = await fetch("/api/backend/admin/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classTypeName: data.classTypeName,
          description: data.description,
          instructorId: data.instructorId,
          classFee: data.classFee,
          photo: null, 
          meetingLink:data.meetingLink , 
          linkExpireDate:new Date(data.linkExpireDate),
          googleEventId:data.googleEventId
        }),
      });

      const result = await res.json().catch(() => ({}));
      

      //  HANDLE ERROR FIRST
      if (!res.ok) {
        toast.error(result?.error || "Failed to create class");
        throw new Error(result?.error || "Failed to create class");
      }

      //  ONLY ON SUCCESS
      toast.success("Class created successfully 🎉");

      return result;
    } catch (err: any) {
      console.error("CREATE CLASS ERROR:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { loading, handleCreate };
}