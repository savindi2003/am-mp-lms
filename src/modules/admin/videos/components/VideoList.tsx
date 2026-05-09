"use client";
import { useState } from "react";
import type { CourseVideoRow } from "../types/typeCourseVideo";
import { Button } from "@/modules/ui/button";

export function VideoList({ videos }: { videos: CourseVideoRow[] }) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (!videos?.length)
    return <p className="text-sm text-slate-500">No videos yet.</p>;

  return (
    <ul className="space-y-2">
      {videos.map((v) => {
        const src = `/api/storage/video?key=${encodeURIComponent(v.s3Key)}`;
        const isOpen = playingId === v.id;

        return (
          <li key={v.id} className="border p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-medium">{v.title}</div>
                <div className="text-xs text-slate-500">
                  {v.visibility} · {v.status}
                </div>
              </div>

              <Button
                onClick={() => setPlayingId(isOpen ? null : v.id)}
                variant="gray"
                disabled={v.status !== "READY"}
              >
                {isOpen ? "Close" : "Play"}
              </Button>
            </div>

            {isOpen && (
              <div className="mt-3">
                <video
                  controls
                  preload="metadata"
                  src={src}
                  className="w-full rounded-xl"
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
