"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import {
  deleteAccount,
  resetPassword,
  updateAccount,
} from "@/modules/admin/accounts/data/actions";
import type { AccountUser } from "@/modules/admin/accounts/types/typeAccountUser";
import { Button } from "@/modules/ui/button";
import Modal from "@/modules/shared/components/Modal";
import ConfirmDelete from "@/modules/shared/components/ConfirmDelete";
import { format } from "date-fns";
import { FiInfo } from "react-icons/fi";
import ShowDetails from "@/modules/shared/components/ShowDetails";
import AccountUpdateForm from "@/modules/admin/accounts/components/AccountUpdateForm";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { passwordSchema } from "@/modules/admin/accounts/validators/updateAccountPasswordSchema";
import UpdateAccountPassword from "@/modules/admin/accounts/components/UpdateAccountPassword";

export default function AccountCard({ user }: { user: AccountUser }) {
  const [isPending, startTransition] = useTransition();
  const [pwd, setPwd] = useState("");
  const router = useRouter();

  async function onDelete() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("userId", String(user.id));
      await deleteAccount(fd);
    });
  }

  function onResetPassword(newPassword: string, onCloseModal?: () => void) {
    const result = passwordSchema.safeParse(newPassword.trim());
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Password is invalid");
      return;
    }

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("userId", String(user.id));
        fd.set("newPassword", result.data);
        await resetPassword(fd);

        toast.success("Password reset successfully");
        onCloseModal?.();
        setPwd(""); // make sure setPwd exists in the parent component
      } catch (e) {
        toast.error("Password reset failed");
      }
    });
  }

  function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const toastId = toast.loading("Saving...");
    const fd = new FormData(e.currentTarget);
    fd.set("userId", String(user.id));
    startTransition(async () => {
      try {
        await updateAccount(fd);
        toast.success("Saved successfully", { id: toastId });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message, { id: toastId });
      }
      router.refresh();
    });
  }

  return (
    <div className="w-full max-w-md bg-white border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm uppercase tracking-wide text-slate-500 font-bold flex items-start gap-2">
            {user.profile?.address &&
              user.profile?.contactNo &&
              user.profile?.dob &&
              user.profile?.guardianContactNo &&
              user.profile?.guardianLastName &&
              user.profile?.gender &&
              user.profile?.guardianFirstName && (
                <Modal>
                  <Modal.Open opens="show-student-details">
                    <button>
                      <FiInfo className="text-slate-700 cursor-pointer ml-auto" />
                    </button>
                  </Modal.Open>
                  <Modal.Window name="show-student-details">
                    <ShowDetails
                      title="Student Details"
                      contactNo={user.profile.contactNo}
                      dob={user.profile.dob.toISOString()}
                      address={user.profile.address}
                      guardianContactNo={user.profile.guardianContactNo}
                      gender={user.profile.gender}
                      guardianLastName={user.profile.guardianLastName}
                      guardianFirstName={user.profile.guardianFirstName}
                    />
                  </Modal.Window>
                </Modal>
              )}
            {user.role}
          </div>
          <h3 className="text-xl font-semibold text-slate-800">
            {user.profile?.firstName ?? "—"} {user.profile?.lastName ?? ""}
          </h3>
          <div className="text-sm text-slate-600">
            {user.email ?? "no-email"}
          </div>
          {user.profile?.title && (
            <div className="text-sm text-slate-600">{user.profile.title}</div>
          )}
        </div>
        <div className="text-xs text-slate-500 ">
          <span className="text-sm font-semibold">{`NIC: ${user.NIC}`}</span>
          <div>{format(new Date(user.createdAt), "dd MMM yyyy hh:mm a")}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Modal>
          <Modal.Open opens="update-account-form">
            <Button variant="secondary">Edit</Button>
          </Modal.Open>
          <Modal.Window name="update-account-form">
            <AccountUpdateForm user={user} onSave={onSave} />
          </Modal.Window>
        </Modal>
        <Modal>
          <Modal.Open opens="update-password">
            <Button variant="secondary">Reset password</Button>
          </Modal.Open>

          <Modal.Window name="update-password">
            <UpdateAccountPassword
              pwd={pwd}
              onChange={setPwd}
              onSubmit={onResetPassword}
              disabled={isPending}
            />
          </Modal.Window>
        </Modal>
        <Modal>
          <Modal.Open opens="account-delete">
            <Button variant="destructive">Delete</Button>
          </Modal.Open>
          <Modal.Window name="account-delete">
            <ConfirmDelete
              resource="account"
              onConfirm={onDelete}
              disabled={isPending}
            />
          </Modal.Window>
        </Modal>
      </div>
    </div>
  );
}
