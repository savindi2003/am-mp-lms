import { Gender } from "@prisma/client";

export type InstructorEnrollment = {
  id: number;
  enrollmentNumber: string;
  enrolledAt: string;
  student: {
    firstName: string | null;
    lastName: string | null;
    user: { NIC: string | null; email: string } | null;
    contactNo: string;
    address: string;
    dob: string;
    gender: Gender;
    guardianContactNo: string;
    guardianFirstName: string;
    guardianLastName: string;
  };
};
