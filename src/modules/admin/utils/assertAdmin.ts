"use server";

import { auth } from "@/app/auth";

export async function assertAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (session.user.role !== "ADMIN") throw new Error("Forbidden");
  return session;
}
