export type Role = "ADMIN" | "INSTRUCTOR" | "STUDENT";
export type Gender = "MALE" | "FEMALE";

export type AccountUser = {
  id: number;
  email: string | null;
  NIC: string;
  userId:string;
  role: Role;
  photo: string | null;
  createdAt: Date;
  profile?: {
    firstName?: string;
    lastName?: string;
    title?: string;
    // student-only
    contactNo?: string;
    address?: string;
    dob?: Date;
    gender?: Gender;
    guardianContactNo?: string;
    guardianFirstName?: string;
    guardianLastName?: string;
  };
};
