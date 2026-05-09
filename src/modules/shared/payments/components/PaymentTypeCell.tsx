"use client";

import Modal from "@/modules/shared/components/Modal";
import PaymentDetailModal from "./PaymentDetailModel";

export default function PaymentTypeCell({
  payment,
}: any) {

  // ✅ SINGLE PAYMENT
  if (payment.type === "SINGLE") {
    return (
      <span className="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-700">
        SINGLE
      </span>
    );
  }

  // ✅ PACKAGE PAYMENT
  return (
    <Modal>

      {/* OPEN BUTTON */}
      <Modal.Open opens={`payment-${payment.id}`} >
        <button
          onClick={(e) => e.stopPropagation()}
          className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-700 transition hover:scale-105"
        >
          PACKAGE
        </button>
      </Modal.Open>

      {/* MODAL */}
      <Modal.Window name={`payment-${payment.id}`}>
        <PaymentDetailModal payment={payment} />
      </Modal.Window>

    </Modal>
  );
}