"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useUpdateUserPhoto } from "@/modules/profile/hooks/useUpdateUserPhoto";
import { useGetCurrentUser } from "@/modules/profile/hooks/useGetCurrentUser";
import { User } from "@/modules/shared/types/typeUser";
import { toKey } from "@/modules/shared/utils/helper";

export default function UserDetails() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { uploadAndSave, loading, photoSrc } = useUpdateUserPhoto();
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const { user }: { user: User | null } = useGetCurrentUser();

  // normalize name fields
  let firstName = null;
  let lastName = null;

  if (user?.role === "STUDENT" && user?.student) {
    firstName = user?.student.firstName;
    lastName = user?.student.lastName;
  } else if (user?.role === "INSTRUCTOR" && user.instructor) {
    firstName = user?.instructor.firstName;
    lastName = user?.instructor.lastName;
  } else if (user?.role === "ADMIN" && user.Admin) {
    firstName = user?.Admin.firstName;
    lastName = user?.Admin.lastName;
  }

  const key = user?.photo ? toKey(user?.photo) : null;
  const initialSrc = key
    ? `/api/storage/image?key=${encodeURIComponent(key)}`
    : null;
  const effectiveSrc = photoSrc ?? initialSrc;

  async function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setLocalPreview(reader.result as string);
    reader.readAsDataURL(file);

    try {
      await uploadAndSave(file);
      setLocalPreview(null);
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Avatar */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 overflow-hidden rounded-full bg-zinc-100">
        {localPreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={localPreview}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        ) : effectiveSrc ? (
          <Image
            src={effectiveSrc}
            alt="User photo"
            width={112}
            height={112}
            className="h-full w-full object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs sm:text-sm text-zinc-400">
            No photo
          </div>
        )}
      </div>

      {/* User Info + Upload */}
      <div className="flex flex-col gap-3 w-full max-w-sm items-center">
        <div>
          <div className="text-lg font-semibold">
            {firstName ?? ""} {lastName ?? ""}
          </div>
          <div className="text-sm text-zinc-500">{user?.email}</div>
        </div>

        {/* Upload Button */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="photo-upload"
            className="inline-flex items-center justify-center px-4 py-2 border border-zinc-300 bg-white text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition"
          >
            {loading ? "Uploading…" : "Change Photo"}
          </label>
          <input
            ref={fileRef}
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            disabled={loading}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
