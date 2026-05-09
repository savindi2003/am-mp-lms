import { Student } from "@/modules/shared/types/typeStudent";
import { Instructor } from "@/modules/shared/types/typeInstructor";
import { Admin } from "@/modules/shared/types/typeAdmin";

export type User = {
  id: number;
  email: string;
  NIC: string;
  hashedPassword: string;
  photo: string | null;
  role: string;
  createdAt: string;
  student?: Student;
  instructor?: Instructor;
  Admin?: Admin;
} | null;
