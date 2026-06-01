export const runtime = "nodejs";

import NextAuth, { NextAuthConfig, type Session, type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { type JWT } from "next-auth/jwt";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const BASE_PATH = "/api/auth";

const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      type: "credentials",
      id: "credentials",
      name: "Credentials",
      credentials: {
        userId: { label: "User Name", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (
          !credentials ||
          typeof credentials.userId !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { userId: credentials.userId },
          include: {
            student: true,
            instructor: true,
            admin: true,
          },
        });

        if (!user || !user.hashedPassword) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword,
        );
        if (!isValid) return null;
        if (!user.userId) throw new Error("User ID is missing");
        return {
          id: user.id.toString(),
          name:
            user.student?.firstName ??
            user.instructor?.firstName ??
            user.admin?.firstName ??
            user.email,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      // Persist the user types to the token on first sign-in
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  basePath: BASE_PATH,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
