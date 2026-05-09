"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { AddYoutubeLinkForm } from "./AddYoutubeLinkForm";
import { YoutubeLinkList } from "../../../shared/components/YoutubeLinkList";
import { useLinks } from "../hooks/useLinks";
import Spinner from "@/modules/shared/components/Spinner";

export function YoutubeManager({ courseId }: { courseId: number }) {
  const { links, loading, onAdd, onSetVisibility, getLinks } =
    useLinks(courseId);

  const [showList, setShowList] = useState(false);

  async function handleCreate(data: {
    title: string;
    description?: string;
    link: string;
    month: string;
  }) {
    const t = toast.loading("Adding video…");
    try {
      await onAdd(data);
      toast.success("Video added", { id: t });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to add video", { id: t });
    }
  }

  async function handleVisibility(id: string, vis: "PUBLISHED" | "HIDDEN") {
    const t = toast.loading("Saving…");
    try {
      await onSetVisibility(id, vis);
      toast.success("Saved", { id: t });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to save", { id: t });
    }
  }

  return (
    <div className="space-y-4">

      {/* ADD FORM ALWAYS VISIBLE */}
      <AddYoutubeLinkForm onCreate={handleCreate} />

      {/* TOGGLE HEADER */}
      <div
        onClick={() => setShowList((prev) => !prev)}
        className="flex items-center justify-between cursor-pointer bg-slate-200 hover:bg-slate-300 px-4 py-2 transition"
      >
        <h2 className="text-sm font-semibold text-gray-700">
          YouTube Videos
        </h2>

        <span className="text-lg">
          {showList ? "▼" : "▶"}
        </span>
      </div>

      {/* LIST ONLY TOGGLED */}
      {showList && (
        <>
          {loading && <Spinner />}

          {!loading && (
            <YoutubeLinkList
              getLinks={getLinks}
              isAdmin={true}
              links={links}
              courseId={courseId}
              onSetVisibility={handleVisibility}
            />
          )}
        </>
      )}
    </div>
  );
}
