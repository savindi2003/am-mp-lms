import type { ResetPasswordPayload } from "@/modules/auth/validators/updatePasswordSchema";

export async function updatePassword({
  currentPassword,
  newPassword,
}: ResetPasswordPayload) {
  const res = await fetch("/api/auth/update-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to update password");

  return result;
}

export async function presignUserPhoto(contentType: string) {
  const res = await fetch("/api/backend/user/photo/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType }),
  });
  if (!res.ok) throw new Error("Failed to get upload URL");
  return res.json();
}

export async function saveUserPhotoKey(key: string) {
  const res = await fetch("/api/backend/user/photo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key }),
  });
  if (!res.ok) throw new Error("Failed to save photo key");
  return (await res.json()) as Promise<{ id: number; photo: string | null }>;
}

export async function getCurrentUser() {
  const res = await fetch("/api/backend/user/get-current-user", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to get current user details");
  return await res.json();
}
