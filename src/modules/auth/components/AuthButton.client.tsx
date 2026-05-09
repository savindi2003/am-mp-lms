"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/modules/ui/button";
import { signIn, signOut } from "@/modules/auth/utils/helpers";

function AuthButtonClient() {
  const session = useSession();
  return session?.data?.user ? (
    <Button
      className="!bg-slate-800"
      onClick={async () => {
        await signOut();
      }}
    >
      Sign Out
    </Button>
  ) : (
    <Button onClick={async () => await signIn()}>Sign In</Button>
  );
}

export default AuthButtonClient;
