"use client";
import { useEffect, useState } from "react";
import {
  finalizeVideo,
  listCourseVideos,
  presignVideoUpload,
} from "../services/apiCourseVideos";
import type { CourseVideoRow } from "../types/typeCourseVideo";
import toast from "react-hot-toast";

export function useCourseVideos(courseId: number) {
  const [videos, setVideos] = useState<CourseVideoRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function refetch() {
    try {
      setLoading(true);
      setVideos(await listCourseVideos(courseId));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load resources");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refetch(); /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [courseId]);

  async function upload(
    file: File,
    opts?: { title?: string; description?: string },
  ) {
    const { uploadUrl, videoId, requiredHeaders } = await presignVideoUpload(
      courseId,
      {
        filename: file.name,
        contentType: file.type || "video/mp4",
        sizeBytes: file.size,
        title: opts?.title ?? file.name,
        description: opts?.description,
      },
    );
    const put = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: requiredHeaders,
    });

    if (!put.ok) throw new Error("Upload failed");

    await finalizeVideo(courseId, { videoId });
    await refetch();
  }

  return { videos, loading, refetch, upload, setVideos };
}
