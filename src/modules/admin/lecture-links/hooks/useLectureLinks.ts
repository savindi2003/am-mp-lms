// import { useEffect, useState } from "react";

// export function useLectureLinks(courseId: number) {
//   const [links, setLinks] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   async function getLinks() {
//     setLoading(true);
//     const res = await fetch(`/api/backend/admin/courses/${courseId}/lecture-links`);
//     const data = await res.json();
//     setLinks(data);
//     setLoading(false);
//   }

//   async function onAdd(data: any) {
//     await fetch(`/api/backend/admin/courses/${courseId}/lecture-links`, {
//       method: "POST",
//       body: JSON.stringify({ ...data, courseId }),
//     });
//     await getLinks();
//   }

//   useEffect(() => {
//     getLinks();
//   }, []);

//   return { links, loading, onAdd, getLinks };
// }

"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  listLectureLinks,
  createLectureLink,
  updateLectureStatus,
} from "../services/apiLectureLinks";

export function useLectureLinks(courseId: number) {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function getLinks() {
    try {
      setLoading(true);
      setLinks(await listLectureLinks(courseId));
    } catch (e: any) {
      console.log(e);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void getLinks();
  }, [courseId]);

  async function onAdd(data: any) {
    await createLectureLink(courseId, data);
    await getLinks();
  }

  // async function onStatusChange(id: string, status: any) {
  //   await updateLectureStatus(courseId, id, status);
  //   await getLinks();
  // }

  async function onStatusChange(id: string, status: string) {
    try {
      await updateLectureStatus(courseId, id, status);
      await getLinks();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  return {
    links,
    loading,
    onAdd,
    onStatusChange,
    getLinks,
  };
}