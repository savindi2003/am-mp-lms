import { Suspense } from "react";
import Spinner from "@/modules/shared/components/Spinner";
import StudentPaymentTable from "@/modules/payments/components/StudentPaymentTable";
import { getStudentPayments } from "@/modules/payments/data/action";

export default async function PaymentsPage() {
  const rows = await getStudentPayments();
  return (
    <section>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="my-5 text-3xl font-semibold text-slate-800">
            My payments
          </h1>
        </div>
      </div>

      <Suspense fallback={<Spinner />}>
        {/* <PaymentCardList /> */}
        <StudentPaymentTable initialRows={rows} />
      </Suspense>
    </section>
  );
}
