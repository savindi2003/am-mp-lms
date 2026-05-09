"use server";

import { prisma } from "@/lib/db";

export async function setUserPhotoKey(userId: number, key: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { photo: key }, // reuse the photo column to store the KEY now
    select: { id: true, photo: true },
  });
}

export async function getStudentDetailsByUserId(userId: number) {
  return await prisma.student.findUnique({
    where: { userId },
    select: {
      firstName: true,
      lastName: true,
      contactNo: true,
      address: true,
      dob: true,
      gender: true,
      guardianContactNo: true,
      guardianFirstName: true,
      guardianLastName: true,
    },
  });
}
