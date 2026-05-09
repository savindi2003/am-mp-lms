import { prisma } from "@/lib/db";

export async function createCourseResource(params: {
  classId: number;
  s3Key: string;
  title: string;
  contentType?: string | null;
  sizeBytes?: number | null;
  uploadedByUserId: number;
  month: string;
}) {
  const { classId, s3Key, title, contentType, sizeBytes, uploadedByUserId, month } =
    params;

  return prisma.courseResource.create({
    data: {
      classId,
      s3Key,
      title,
      contentType: contentType ?? null,
      sizeBytes: sizeBytes ?? null,
      uploadedByUserId,
      month,
    },
    select: {
      id: true,
      classId: true,
      s3Key: true,
      title: true,
      contentType: true,
      sizeBytes: true,
      createdAt: true,
    },
  });
}
