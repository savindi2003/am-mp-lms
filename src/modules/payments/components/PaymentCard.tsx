import { Progress } from "@/modules/ui/progress";
import type { PaymentSummary } from "@/modules/payments/types/typePaymentSummary";
import { formatCurrency, getCourseName } from "@/modules/shared/utils/helper";
import { format } from "date-fns";

export default function PaymentCard({ row }: { row: PaymentSummary }) {
  const isCleared = row.outstanding <= 0;
  const progress =
    row.courseFee > 0
      ? Math.min(
          100,
          Math.max(0, Math.round((row.paidTotal / row.courseFee) * 100)),
        )
      : row.paidTotal > 0
        ? 100
        : 0;

  return (
    <article className="group relative flex flex-col border bg-background p-4 shadow-sm transition hover:shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3">
        <img
          src={`/api/storage/image?key=${encodeURIComponent(row.photo)}`}
          alt=""
          className="h-20 w-20 flex-none"
        />
        <div className="min-w-0">
          <div className="truncate font-medium text-slate-800">
            {getCourseName(row.courseType.name)}
          </div>
        </div>
      </div>

      {/* Amounts */}
      <dl className="mt-4 space-y-2 text-base">
        <div className="flex items-center justify-between">
          <dt className="text-slate-700">Course Fee</dt>
          <dd className="font-medium text-slate-700">
            {formatCurrency(row.courseFee)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-slate-700">Paid</dt>
          <dd className="font-medium text-slate-700">
            {formatCurrency(row.paidTotal)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-slate-700 font-medium">Outstanding</dt>
          <dd
            className={[
              "font-semibold",
              isCleared ? "text-green-500" : "text-red-500",
            ].join(" ")}
          >
            {isCleared ? "Cleared" : formatCurrency(row.outstanding)}
          </dd>
        </div>
        {row.lastPaymentAt && (
          <div className="flex items-center justify-between">
            <dt className="text-slate-600">Last payment</dt>
            <dd className="tabular-nums text-slate-700">
              {new Date(row.lastPaymentAt).toLocaleDateString()}
            </dd>
          </div>
        )}
      </dl>

      {/* Progress */}
      <div className="mt-4">
        <Progress value={progress} />
        <div className="mt-1 text-right text-xs text-slate-500">
          {progress}% paid
        </div>
      </div>

      {/* Footer status */}
      <div className="mt-4 flex items-center justify-between">
        <span
          className={[
            "w-full px-2.5 py-1 text-center text-sm",
            isCleared
              ? "bg-green-200 text-green-700"
              : "bg-red-200 text-red-700",
          ].join(" ")}
        >
          <p>
            {" "}
            {isCleared ? "Settled" : "Due At "}
            {row.nextDueAt && format(new Date(row.nextDueAt), "PP")}
          </p>
        </span>
      </div>
    </article>
  );
}
