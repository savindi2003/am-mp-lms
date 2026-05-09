import { Enrollment } from "@/modules/shared/types/typeEnrollment";
import { User } from "@/modules/shared/types/typeUser";
import type { Gender } from "@prisma/client";

export type Student =
  | {
      id: number;
      firstName: string;
      lastName: string;
      dob: string;
      contactNo: string;
      address: string;
      guardianContactNo: string;
      guardianFirstName: string;
      guardianLastName: string;
      gender: Gender;
      enrollmentNo: string;
      createdAt: string;
      userId: number;
      enrollments?: Enrollment[];
      user: User;
    }
  | undefined;
