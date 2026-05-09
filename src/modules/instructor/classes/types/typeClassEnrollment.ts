import { EnrollmentStatus, Gender } from "@prisma/client";

export type ClassEnrollment = {
  id: number;
  enrollmentNumber: string;
  enrolledAt: string;
  activeMonth: string | null;
  enrollmentStatus: EnrollmentStatus;

  student: {
    firstName: string;
    lastName: string;
    contactNo: string;
    address: string;
    dob: string;
    gender: Gender;
    guardianContactNo: string;
    guardianFirstName: string;
    guardianLastName: string;

    user: {
      NIC: string;
      email: string;
    } | null;
  };
};