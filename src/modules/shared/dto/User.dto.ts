export type RoleDTO = "STUDENT" | "INSTRUCTOR" | "ADMIN";

export type StudentLite = {
  id: number;
  firstName: string;
  lastName: string;
  createdAt: string; // serialized
  userId: number;
};

export type InstructorLite = {
  id: number;
  firstName: string;
  lastName: string;
  title: string;
  createdAt: string; // serialized
  userId: number;
};

export type AdminLite = {
  id: number;
  firstName: string;
  lastName: string;
  createdAt: string; // serialized
  userId: number;
};

type BaseUserDTO = {
  id: number;
  email: string;
  NIC: string;
  userId: string | null
  photo: string | null;
  role: RoleDTO;
  createdAt: string; // we serialize Date -> string
};

export type StudentUserDTO = BaseUserDTO & {
  role: "STUDENT";
  student: StudentLite | null;
  instructor: null;
  admin: null;
};

export type InstructorUserDTO = BaseUserDTO & {
  role: "INSTRUCTOR";
  student: null;
  instructor: InstructorLite | null;
  admin: null;
};

export type AdminUserDTO = BaseUserDTO & {
  role: "ADMIN";
  student: null;
  instructor: null;
  admin: AdminLite | null;
};

export type CurrentUserDTO = StudentUserDTO | InstructorUserDTO | AdminUserDTO;
