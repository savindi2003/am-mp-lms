import { User } from "@/modules/shared/types/typeUser";

export type Instructor = {
  id: number;
  firstName: string;
  photo: string;
  lastName: string;
  userId: number;
  title: string;
  createdAt: string;
  user: User;
} | null;
