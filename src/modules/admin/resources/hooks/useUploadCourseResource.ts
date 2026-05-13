"use client";

import { useState } from "react";
import {
  presignCourseResource,
  saveCourseResourceKey,
} from "@/modules/admin/resources/services/apiCourseResources";
import toast from "react-hot-toast";

const MAX_MB = 50;

// Same allow-list as the presign route
const ALLOWED_EXACT = new Set<string>([
  "application/pdf",
  "application/zip",
  "application/msword",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
]);

function isAllowedContentType(t: string) {
  return t.startsWith("image/") || ALLOWED_EXACT.has(t);
}

function buildOpenUrl(key: string) {
  return `/api/storage/image?key=${encodeURIComponent(key)}`;
}

type UploadOptions = {
  title?: string;
  month?: string;
};

export function useUploadCourseResource(courseId: number) {
  const [loading, setLoading] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null); // for images

  async function uploadAndSave(file: File, opts?: UploadOptions) {
    try {
      if (!courseId || Number.isNaN(courseId)) {
        throw new Error("Invalid course id");
      }
      if (!file?.type) throw new Error("File has no content type");
      if (!isAllowedContentType(file.type)) {
        throw new Error("Unsupported file type");
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        throw new Error(`Max size ${MAX_MB}MB`);
      }

      setLoading(true);

      // 1) presign
      const { uploadUrl, key, requiredHeaders } = await presignCourseResource(
        courseId,
        file.type,
        file.name,
      );

      // 2) upload to S3
      const put = await fetch(uploadUrl, {
        method: "PUT",
        headers: requiredHeaders ?? { "Content-Type": file.type },
        body: file,
      });
      if (!put.ok) throw new Error("Upload failed");

      // 3) save DB row
      const created = await saveCourseResourceKey(courseId, {
        key,
        title: opts?.title ?? file.name,
        contentType: file.type,
        sizeBytes: file.size,
        month: opts?.month,
        
        
      });

      // preview for images
      if (file.type.startsWith("image/")) {
        setPreviewSrc(buildOpenUrl(key));
      } else {
        setPreviewSrc(null);
      }

      // Return the created resource row + an "openUrl" to use in UI
      return {
        ...created,
        openUrl: buildOpenUrl(key),
      } as typeof created & { openUrl: string };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { uploadAndSave, loading, previewSrc, setPreviewSrc };
}
