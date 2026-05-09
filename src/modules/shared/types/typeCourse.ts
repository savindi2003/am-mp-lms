import { Instructor } from "@/modules/shared/types/typeInstructor";
import { CourseDay } from "@/modules/shared/types/typeCourseDay";

export interface Course {
  id: number;
  courseType: {
    name: string;
    id: number;
  };
  photo: string;
  courseFee: number;
  description: string;
  instructorId: number;
  createdAt: string;
  instructor?: Instructor;
  courseDay?: CourseDay[];
}

export interface CourseWithStudent extends Course {
  Student: Record<string, number | string>;
}
