"use client";

import { ImSpinner2 } from "react-icons/im";
import { Button } from "@/modules/ui/button";
import { useFormStatus } from "react-dom";
import { signOut } from "@/modules/auth/utils/helpers";

type ConfirmSignOutProps = {
  onCloseModal?: () => void;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="destructive"
      disabled={pending}
      className="gap-2"
    >
      {pending ? (
        <>
          <span>Signing out…</span>
          <ImSpinner2 size={18} className="animate-spin" />
        </>
      ) : (
        "Sign out"
      )}
    </Button>
  );
}

export default function ConfirmSignOut({ onCloseModal }: ConfirmSignOutProps) {
  return (
    <div>
      <h2 className="text-md font-semibold md:text-2xl text-slate-800">
        Confirm sign out
      </h2>

      <p className="my-5 flex w-xs items-center justify-center border-2 border-red-300 bg-red-200 p-2 pl-5 text-[12px] font-semibold text-destructive sm:my-10 sm:h-20 sm:w-auto sm:px-12 sm:text-sm">
        Are you sure you want to sign out? You’ll need to sign in again to
        continue.
      </p>

      <div className="flex w-full justify-end gap-3 px-7">
        <Button variant="secondary" type="button" onClick={onCloseModal}>
          Cancel
        </Button>

        {/* Use a form so the server action runs reliably */}
        <form action={signOut}>
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
