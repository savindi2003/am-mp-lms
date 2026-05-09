"use client";

import type { Payment } from "@/modules/admin/enrollments/types/typePayment";
import Table from "@/modules/shared/components/Table";
import PaymentRow from "@/modules/admin/enrollments/payments/components/PaymentRow";

type PaymentsTableProps = {
  payments: Payment[];
  onGetPayments: () => Promise<void>;
};

export default function PaymentTable({
  payments,
  onGetPayments,
}: PaymentsTableProps) {
  return (
    <div className="overflow-x-auto border bg-white">
      <Table>
        <Table.Header styles="grid grid-cols-4 md:grid-cols-4 px-4 py-3 text-sm font-medium bg-gray-100"> 
          <div role="columnheader" className="min-w-0 truncate">
            Amount
          </div>
          <div role="columnheader" className="min-w-0 truncate">
            Paid Month
          </div>
          <div role="columnheader" className="min-w-0 truncate">
            Date & Time
          </div>
          <div role="columnheader" className="min-w-0 truncate"></div>
        </Table.Header>
        <Table.Body
          data={payments}
          render={(payment) => (
            <PaymentRow
              payment={payment}
              key={payment.id}
              onGetPayments={onGetPayments}
            />
          )}
        ></Table.Body>
      </Table>
    </div>
  );
}
