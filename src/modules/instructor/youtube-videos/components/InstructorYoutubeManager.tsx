"use client";

import { YoutubeLinkList } from "@/modules/shared/components/YoutubeLinkList";
import { useLinks } from "@/modules/admin/youtube-videos/hooks/useLinks";
import toast from "react-hot-toast";

function InstructorYoutubeManager({ courseId }: { courseId: number }) {
  console.log(courseId);
  const { links, onSetVisibility, getLinks } = useLinks(courseId);

  async function handleVisibility(id: string, vis: "PUBLISHED" | "HIDDEN") {
    const toastId = toast.loading("Saving…");
    try {
      await onSetVisibility(id, vis);
      toast.success("Saved", { id: toastId });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to save", { id: toastId });
    }
  }

  return (
    <div>
      <YoutubeLinkList
        getLinks={getLinks}
        links={links}
        courseId={courseId}
        onSetVisibility={handleVisibility}
        isAdmin={false}
      />
    </div>
  );
}

export default InstructorYoutubeManager;
