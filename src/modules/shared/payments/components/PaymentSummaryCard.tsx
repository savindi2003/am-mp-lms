"use client";

export default function PaymentsSummaryCard({
  total,
  month,
}: any) {
  return (
    <div className="sticky top-6 h-fit w-full bg-gray-100 p-4 ">
      <h2 className="text-sm">
        {month} Earnings
      </h2>

      <p className="mt-2 text-3xl font-bold text-green-600">
        Rs {total?.toLocaleString() || 0}
      </p>

      <p className="mt-2 text-xs text-slate-700-400 text-end">
        Total collected payments
      </p>
    </div>
  );
}