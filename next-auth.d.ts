import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    photo?: string;
    name?: string | null;
    role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  }
}
