export type CourseResourceRow = {
  id: string;
  title: string;
  s3Key: string;
  contentType: string | null;
  sizeBytes: number | null;
  createdAt: string;
  uploadedBy: { id: number; email: string } | null;
  month: string;
};
