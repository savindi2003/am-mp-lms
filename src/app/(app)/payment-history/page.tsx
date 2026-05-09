"use client";

import { useState } from "react";
import PaymentsFilters from "@/modules/shared/payments/components/PaymentFilters";
import PaymentsTable from "@/modules/shared/payments/components/PaymentsTable";
import PaymentsSummaryCard from "@/modules/shared/payments/components/PaymentSummaryCard";
import { usePayments } from "@/modules/shared/payments/hooks/usePayments";

export default function PaymentsPage() {
    const currentMonth =
        new Date().toISOString().slice(0, 7);

    const [month, setMonth] =
        useState(currentMonth);

    const [page, setPage] = useState(1);

    const { data, loading } = usePayments(
        month,
        page,
    );

    return (
        <section className="">

            <div className="flex justify-between my-6">

                <div className="flex flex-col justify-center gap-2">

                    <h1 className="text-2xl font-semibold">
                        Payments
                    </h1>

                    <PaymentsFilters
                        month={month}
                        setMonth={(m: any) => {
                            setMonth(m);
                            setPage(1);
                        }}
                    />

                </div>


                <div className="w-72">
                    <PaymentsSummaryCard
                        total={data?.totalEarnings}
                        month={month}
                    />
                </div>


            </div>

            <div>
                <PaymentsTable data={data} />

                {/* PAGINATION */}
                <div className="flex gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() =>
                            setPage(page - 1)
                        }
                    >
                        Prev
                    </button>

                    <button
                        onClick={() =>
                            setPage(page + 1)
                        }
                    >
                        Next
                    </button>
                </div>
            </div>


        </section>

    );
}