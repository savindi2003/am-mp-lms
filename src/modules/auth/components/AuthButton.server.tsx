"use server";

import { auth, BASE_PATH } from "@/app/auth";
import { SessionProvider } from "next-auth/react";
import AuthButtonClient from "@/modules/auth/components/AuthButton.client";

async function AuthButton() {
  const session = await auth();
  if (session && session?.user) {
    session.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
    };
  }
  return (
    <SessionProvider basePath={BASE_PATH} session={session}>
      <AuthButtonClient />
    </SessionProvider>
  );
}

export default AuthButton;
