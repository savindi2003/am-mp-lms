"use client";
import { useEffect, useState } from "react";
import type { YoutubeLinkRow } from "../types/typeYoutubeLink";
import {
  createYoutubeLink,
  listYoutubeLinks,
  setYoutubeLinkVisibility,
} from "../services/apiYoutubeLinks";
import toast from "react-hot-toast";

export function useLinks(courseId: number) {
  const [links, setLinks] = useState<YoutubeLinkRow[]>([]);
  const [loading, setLoading] = useState(false);

  async function getLinks() {
    try {
      setLoading(true);
      setLinks(await listYoutubeLinks(courseId));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial load
    void getLinks();
  }, [courseId]);

  async function handleAdd(d: {
    title: string;
    description?: string;
    link: string;
    month: string;
  }) {
    await createYoutubeLink(courseId, d);
    await getLinks();
  }

  async function onSetVisibility(
    videoId: string,
    visibility: "PUBLISHED" | "HIDDEN",
  ) {
    await setYoutubeLinkVisibility(courseId, videoId, visibility);
    await getLinks();
  }

  return {
    links,
    loading,
    onAdd: handleAdd,
    onSetVisibility,
    getLinks,
  };
}
