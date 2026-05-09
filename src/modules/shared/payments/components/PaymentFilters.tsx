"use client";

export default function PaymentsFilters({
  month,
  setMonth,
}: any) {
  const currentMonth =
    new Date().toISOString().slice(0, 7);

  return (
    <div className="mb-4 flex items-center gap-3">
      <input
        type="month"
        value={month}
        onChange={(e) =>
          setMonth(e.target.value)
        }
        className="rounded border px-3 py-2 text-sm"
      />

      <button
        onClick={() =>
          setMonth(currentMonth)
        }
        className="text-xs text-blue-600"
      >
        Current Month
      </button>
    </div>
  );
}