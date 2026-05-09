export type CourseVideoRow = {
  id: string;
  title: string;
  description?: string | null;
  visibility: "PUBLISHED" | "HIDDEN";
  status: "UPLOADING" | "READY" | "FAILED" | "DELETED";
  s3Key: string;
  durationSeconds?: number | null;
  createdAt: string;
};
