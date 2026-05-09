"use client";
import { useCourseVideos } from "../hooks/useCourseVideos";
import { UploadPanel } from "./UploadPanel";
import { VideoList } from "./VideoList";

export function VideoManager({ courseId }: { courseId: number }) {
  const { videos, loading, upload } = useCourseVideos(courseId);

  return (
    <div className="space-y-4">
      <UploadPanel onUpload={upload} />
      {loading && <div className="text-sm text-slate-500">Loading…</div>}
      {!loading && <VideoList videos={videos} />}
    </div>
  );
}
