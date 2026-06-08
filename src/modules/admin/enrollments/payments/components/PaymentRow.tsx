"use client";
import { format } from "date-fns";
import Table from "@/modules/shared/components/Table";
import { formatCurrency } from "@/modules/shared/utils/helper";
import { useDeletePayment } from "@/modules/admin/enrollments/payments/hooks/useDeletePayment";
import Modal from "@/modules/shared/components/Modal";
import ConfirmDelete from "@/modules/shared/components/ConfirmDelete";
import { HiTrash } from "react-icons/hi2";
import {Payment} from "@/modules/admin/enrollments/types/typePayment";

export default function PaymentRow({
  payment,
  onGetPayments,
}: {
  payment: Payment;
  onGetPayments: () => Promise<void>;
}) {
  const { onDeletePayment } = useDeletePayment();
  return (
    <Table.Row styles="grid grid-cols-3 items-center border-t px-4 py-3">
  <div className="text-base text-slate-700 font-medium">
        {formatCurrency(payment.amount)}
      </div>
      <div className="text-sm text-slate-800">
        {payment.month}
      </div>
      <div className="text-sm text-slate-800">
        {format(new Date(payment.createdAt), "dd MMM yyyy hh:mm a")}
      </div>
      
    </Table.Row>
  );
}
