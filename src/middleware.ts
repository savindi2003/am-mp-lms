import { NextResponse } from "next/server";

import { auth } from "@/app/auth";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)",
  ],
};

// Helper: path starts with any of these prefixes
const startsWithAny = (path: string, prefixes: string[]) =>
  prefixes.some((p) => path === p || path.startsWith(p + "/"));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default auth((req: any) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // Public pages
  const isPublicPath = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/",
  ].includes(pathname);

  if (!req.auth && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!req.auth) return NextResponse.next();

  const role = (req.auth.user?.role ?? null) as
    | "STUDENT"
    | "INSTRUCTOR"
    | "ADMIN"
    | null;

  // === Role-based route controls ===

  // Admin
  if (role !== "ADMIN" && startsWithAny(pathname, ["/admin"]))
    return NextResponse.redirect(new URL("/login", req.url));

  //instructor
  if (role !== "INSTRUCTOR" && startsWithAny(pathname, ["/instructor"])) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  //student
  if (role !== "STUDENT" && startsWithAny(pathname, ["/payments"]))
    return NextResponse.redirect(new URL("/login", req.url));
});
