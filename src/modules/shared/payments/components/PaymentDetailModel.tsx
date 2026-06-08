"use client";

export default function PaymentDetailsModal({
  payment,
}: any) {
  return (
    <div className="w-full p-5 space-y-4 ">

      <div>
        <h2 className="text-lg font-semibold text-slate-800">
          Payment Details
        </h2>

        <p className="text-xs text-gray-500">
          Payment #{payment.id}
        </p>
      </div>

      {/* CLASS LIST */}
      <div className=" p-3">
        <h3 className="font-medium text-sm text-slate-700 mb-3">
          {payment.type === "PACKAGE"
            ? "Package Classes"
            : "Class Details"}
        </h3>

        <div className="space-y-2">
          {payment.classes?.map(
            (c: any) => (
              <div
                key={c.id}
                className="bg-gray-100 p-2"
              >
                <p className="text-sm font-medium">
                  {c.name}
                </p>

                <p className="text-xs text-gray-500">
                  {c.classType}
                </p>
              </div>
            ),
          )}
        </div>
      </div>

    </div>
  );
}