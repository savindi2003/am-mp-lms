import { Gender } from "@prisma/client";

export type DueExpireItem = {
  id: number;
  nic: string;
  enrolledAt: string;
  email: string;
  name: string;
  contactNo: string;
  address: string;
  enrollmentStatus: string;
  dob: string;
  gender: Gender;
  guardianContactNo: string;
  guardianFirstName: string;
  guardianLastName: string;
  dueAmount: number;
  dueDate: string;
  enrollmentNumber: string;
  courseType: {
    name: string;
    id: number;
  };
  courseDay: string;
};
