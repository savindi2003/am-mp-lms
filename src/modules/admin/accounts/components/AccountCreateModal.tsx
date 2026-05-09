"use client";

import Modal from "@/modules/shared/components/Modal";
import { Button } from "@/modules/ui/button";
import AccountCreateForm from "@/modules/admin/accounts/components/AccountCreateForm";

function AccountCreateModal() {
  return (
    <Modal>
      <Modal.Open opens="create-account-form">
        <Button>Create Account</Button>
      </Modal.Open>
      <Modal.Window name="create-account-form">
        <AccountCreateForm />
      </Modal.Window>
    </Modal>
  );
}

export default AccountCreateModal;
