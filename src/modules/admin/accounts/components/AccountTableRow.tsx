"use client";

import { format } from "date-fns";
import Modal from "@/modules/shared/components/Modal";
import ConfirmDelete from "@/modules/shared/components/ConfirmDelete";
import AccountUpdateForm from "./AccountUpdateForm";
import UpdateAccountPassword from "./UpdateAccountPassword";
import { useState, useTransition } from "react";
import {
  deleteAccount,
  resetPassword,
  updateAccount,
} from "@/modules/admin/accounts/data/actions";
import toast from "react-hot-toast";
import { passwordSchema } from "@/modules/admin/accounts/validators/updateAccountPasswordSchema";
import { Button } from "@/modules/ui/button";

export default function AccountTableRow({
  user,
}: {
  user: any;
}) {
  const [pwd, setPwd] = useState("");
  const [isPending, startTransition] = useTransition();

  // CLEAN PROFILE USAGE
  const firstName = user.profile?.firstName ?? "—";
  const lastName = user.profile?.lastName ?? "";
  const contact = user.profile?.contactNo ?? "—";

  // DELETE
  async function onDelete() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("userId", String(user.id));
      await deleteAccount(fd);
      toast.success("Deleted");
    });
  }

  // RESET PASSWORD
  function onResetPassword(
    newPassword: string,
    onClose?: () => void
  ) {
    const result =
      passwordSchema.safeParse(newPassword);

    if (!result.success) {
      toast.error("Invalid password");
      return;
    }

    startTransition(async () => {
      const fd = new FormData();
      fd.set("userId", String(user.id));
      fd.set("newPassword", result.data);

      await resetPassword(fd);
      toast.success("Password reset");
      setPwd("");
      onClose?.();
    });
  }

  // EDIT
  function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    fd.set("userId", String(user.id));

    startTransition(async () => {
      await updateAccount(fd);
      toast.success("Updated");
    });
  }

  return (
    <tr className="border-t ">
      {/* NAME */}
      <td className="p-3 font-medium">
        <div>
          {firstName} {lastName}
        </div>

        <div className="text-xs text-white bg-slate-500 w-max px-1">
          {user.userId}
        </div>
        
      </td>

      {/* EMAIL */}
      <td className="p-3">{user.email}</td>

      {/* ROLE */}
      <td className="p-3">{user.role}</td>

      {/* NIC */}
      <td className="p-3">{user.NIC}</td>

      {/* CONTACT */}
      <td className="p-3">{contact}</td>

      {/* CREATED */}
      <td className="p-3">
        {format(
          new Date(user.createdAt),
          "dd MMM yyyy"
        )}
      </td>

      {/* ACTIONS */}
      <td className="p-3">
        <div className="flex gap-2 justify-center">
          {/* EDIT */}
          <Modal>
            <Modal.Open opens="edit">
              <Button size="sm" variant="secondary" className="rounded-none">Edit</Button>
            </Modal.Open>

            <Modal.Window name="edit">
              <AccountUpdateForm
                user={user}
                onSave={onSave}
              />
            </Modal.Window>
          </Modal>

          {/* RESET */}
          <Modal>
            <Modal.Open opens="reset">
              <Button size="sm" variant="secondary" className="rounded-none">Reset</Button>
            </Modal.Open>

            <Modal.Window name="reset">
              <UpdateAccountPassword
                pwd={pwd}
                onChange={setPwd}
                onSubmit={onResetPassword}
                disabled={isPending}
              />
            </Modal.Window>
          </Modal>

          {/* DELETE */}
          <Modal>
            <Modal.Open opens="delete">
              <Button size="sm" variant="destructive" className="rounded-none">
                Delete
              </Button>
            </Modal.Open>

            <Modal.Window name="delete">
              <ConfirmDelete
                resource="account"
                onConfirm={onDelete}
                disabled={isPending}
              />
            </Modal.Window>
          </Modal>
        </div>
      </td>
    </tr>
  );
}