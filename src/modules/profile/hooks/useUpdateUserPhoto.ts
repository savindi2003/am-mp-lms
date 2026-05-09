"use client";

import { useState } from "react";
import {
  presignUserPhoto,
  saveUserPhotoKey,
} from "@/modules/profile/services/apiUser";
import toast from "react-hot-toast";

const MAX_MB = 5;

export function useUpdateUserPhoto() {
  const [loading, setLoading] = useState(false);
  const [photoSrc, setPhotoSrc] = useState<string | null>(null); // src for <Image>

  async function uploadAndSave(file: File) {
    try {
      if (!file.type.startsWith("image/"))
        throw new Error("Please select an image");
      if (file.size > MAX_MB * 1024 * 1024)
        throw new Error(`Max size ${MAX_MB}MB`);

      setLoading(true);

      const { uploadUrl, key, requiredHeaders } = await presignUserPhoto(
        file.type,
      );

      const put = await fetch(uploadUrl, {
        method: "PUT",
        headers: requiredHeaders ?? { "Content-Type": file.type },
        body: file,
      });
      if (!put.ok) throw new Error("Upload failed");

      const updated = await saveUserPhotoKey(key);

      const src = `/api/storage/image?key=${encodeURIComponent(key)}`;
      setPhotoSrc(src);
      return updated.photo; // this is the key stored in DB
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
      throw e;
      
    } finally {
      setLoading(false);
    }
  }

  return { uploadAndSave, loading, photoSrc, setPhotoSrc };
}
