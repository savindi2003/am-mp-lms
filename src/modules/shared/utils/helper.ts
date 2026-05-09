import { CurrentUserDTO } from "@/modules/shared/dto/User.dto";
import { s3 } from "@/server/s3"; // same client you used for user photo
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET = process.env.S3_BUCKET!;
export const formatCurrency = (value: number) =>
  `Rs. ${new Intl.NumberFormat("en-LK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`;

export function getUserName(user: CurrentUserDTO): {
  firstName: string | null;
  lastName: string | null;
} {
  switch (user.role) {
    case "STUDENT":
      return {
        firstName: user.student?.firstName ?? null,
        lastName: user.student?.lastName ?? null,
      };
    case "INSTRUCTOR":
      return {
        firstName: user.instructor?.firstName ?? null,
        lastName: user.instructor?.lastName ?? null,
      };
    case "ADMIN":
      return {
        firstName: user.admin?.firstName ?? null,
        lastName: user.admin?.lastName ?? null,
      };
  }
}

export function toKey(value: string | null | undefined) {
  if (!value) return null;

  if (value.startsWith("users/")) return value;
  try {
    const u = new URL(value);
    return u.pathname.replace(/^\/+/, "");
  } catch {
    return value.replace(/^\/+/, "");
  }
}

export function getCourseName(courseType: string) {
  // return courseType
  //   .toLowerCase()
  //   .split("_")
  //   .map((word) => word[0].toUpperCase() + word.slice(1))
  //   .join(" ");
  return courseType;
}

export function extractYoutubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || null;
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
    return null;
  } catch {
    return null;
  }
}

export function formatCapital(day: string) {
  return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
}
export async function getSignedReadUrl(key: string, expiresInSeconds = 60) {
  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(s3, cmd, { expiresIn: expiresInSeconds });
}
