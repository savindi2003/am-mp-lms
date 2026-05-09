import { Course } from "@/modules/shared/types/typeCourse";
import { Student } from "@/modules/shared/types/typeStudent";
import { Payment } from "@/modules/admin/enrollments/types/typePayment";


export interface Enrollment {
  id: number;
  enrollmentNumber: string;
  enrollmentStatus: string;
  enrolledAt: string;

  studentId: number;
  classId: number;

  activeMonth?: string;

  student?: Student;

  class?: {
    id: number;
    description: string;
    classFee: number;
  };
}