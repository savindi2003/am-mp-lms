"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

import { CreatePaymentFormData } from "@/modules/admin/enrollments/validators/createPaymentSchema";

const PAGE_SIZE = Number(process.env.NEXT_PUBLIC_PAGE_SIZE!);

export type CreatePaymentState = {
  ok?: boolean;
  error?: string;
  newEnrollmentId?: number;
};

function createEnrollmentNumber(courseType: string) {
  const currentYear = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000) // 0–999
    .toString()
    .padStart(3, "0");
  const baseYear = 2025;
  const number = currentYear - baseYear + 1;
  const shortCourseType = courseType
    .split("_")
    .map((word) => word[0])
    .join("");

  return `AMA/${shortCourseType}/B${number}/${random}`;
}


export async function getStudentNICs() {
  return await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: {
      NIC: true,
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

