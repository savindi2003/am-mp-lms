"use client";

import PaymentTypeCell from "./PaymentTypeCell";

export default function PaymentsTable({ data }: any) {
  return (
    <div className="border bg-white">

      {/* TABLE WRAPPER (SCROLL AREA) */}
      <div className="max-h-[500px] overflow-y-auto">

        <table className="w-full text-sm">

          {/* HEADER (STICKY) */}
          <thead className="bg-gray-100 text-left sticky top-0 z-10">
            <tr>
              <th className="p-2">Student</th>
              <th className="p-2">NIC</th>
              <th className="p-2">Type</th>
              <th className="p-2">Month</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>

          <tbody>
            {data?.payments?.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No payments found
                </td>
              </tr>
            )}

            {data?.payments?.map((p: any) => (
              <tr key={p.id} className="border-t">

                <td className="p-2">
                  {p.student?.firstName} {p.student?.lastName}
                </td>

                <td className="p-2">
                  {p.student?.user?.NIC}
                </td>

                <td className="p-2">
                  <PaymentTypeCell payment={p} />

                  {/* ONLY SINGLE */}
                  {p.type === "SINGLE" && (
                    <div className="text-xs text-gray-500 mt-1">
                      {p.classes?.map((c: any, i: number) => (
                        <div key={i}>
                          {c.classType} - {c.name}
                        </div>
                      ))}
                    </div>
                  )}
                </td>

                <td className="p-2">{p.month}</td>

                <td className="p-2 font-semibold">Rs {p.amount}</td>

                <td className="p-2 text-xs text-gray-500">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}