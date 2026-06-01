"use client";

import { useState } from "react";
import PaymentsFilters from "@/modules/shared/payments/components/PaymentFilters";
import PaymentsTable from "@/modules/shared/payments/components/PaymentsTable";
import PaymentsSummaryCard from "@/modules/shared/payments/components/PaymentSummaryCard";
import { usePayments } from "@/modules/shared/payments/hooks/usePayments";
import Spinner from "./Spinner";

export default function PaymentsClient() {
    const currentMonth = new Date().toISOString().slice(0, 7);

    const [month, setMonth] = useState(currentMonth);
    

    //   const { data } = usePayments(month, page);
    const { data, loading } = usePayments(month);

    return (
        <section>
            <div className="flex justify-between my-6">
                <div>
                    <h1 className="text-2xl font-semibold mb-4">Payments</h1>

                    <PaymentsFilters
                        month={month}
                        setMonth={(m: any) => {
                            setMonth(m);
                            
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


            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <Spinner />

                </div>
            ) : (
                <PaymentsTable data={data} />
            )}



        </section>
    );
}