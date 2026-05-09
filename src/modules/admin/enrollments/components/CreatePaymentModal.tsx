"use client";

import Modal from "@/modules/shared/components/Modal";
import { Button } from "@/modules/ui/button";
import { Plus } from "lucide-react";
import CreatePaymentForm from "../../payments/components/CreatePaymentForm";

export default function CreatePaymentModal({
  getEnrollments,
}: {
  getEnrollments: () => Promise<void>;
}) {
  return (
    <Modal>
      <Modal.Open opens="payment-create">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Payment
        </Button>
      </Modal.Open>
      <Modal.Window name="payment-create">
        <CreatePaymentForm />
      </Modal.Window>
    </Modal>
  );
}
