import Table from "@/modules/shared/components/Table";
import { format } from "date-fns";
import { formatCurrency } from "@/modules/shared/utils/helper";
import { useUpdateLinkAccess } from "@/modules/admin/youtube-videos/[videoId]/access-control/hooks/useUpdateLinkAccess";
import { useEffect, useState } from "react";
import type { AccessRow } from "../services/apiAccessControl";

type Props = {
  paramId: { courseId: number; videoId: string };
  row: AccessRow;
};

function AccessControlRow({ paramId, row }: Props) {
  const { updateLinkAccess } = useUpdateLinkAccess();
  const [checked, setChecked] = useState<boolean>(row.isAccessed);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setChecked(row.isAccessed);
  }, [row.isAccessed]);

  const dueAmount = Math.max(0, row.courseFee - row.totalPaid);

  async function handleToggle() {
    const next = !checked; // optimistic
    setChecked(next);
    setSaving(true);
    try {
      const res = await updateLinkAccess(
        paramId.courseId,
        paramId.videoId,
        row.id,
        next,
      );
      setChecked(Boolean(res?.isAccessed ?? next)); // trust server
    } catch {
      setChecked(!next); // revert
    } finally {
      setSaving(false);
    }
  }

  return (
    <Table.Row styles="grid grid-rows-2 grid-cols-[1.2fr_1.2fr_1fr] md:grid-rows-1 md:grid-cols-[1.2fr_1.2fr_1fr_1fr_0.5fr] items-start">
      <div className="flex flex-col">
        <span className="text-xs md:text-base font-medium text-slate-700">
          {row.student.firstName} {row.student.lastName}
        </span>
        <span className="max-w-[120px] text-xs break-words text-slate-500 font-semibold md:max-w-xs md:text-sm">
          {row.student.enrollmentNo}
        </span>
      </div>

      <div
        className={`text-xs md:text-sm font-medium ${row.plan === "FULL" ? "text-green-600" : "text-red-600"}`}
      >
        {row.plan}
      </div>

      <div className="text-[9px] md:text-sm">
        {dueAmount > 0 ? (
          <span className="text-red-50 bg-red-500 px-1 font-medium">
            {`Due ${formatCurrency(dueAmount)}`}
          </span>
        ) : (
          <span className="text-green-50 bg-green-500 px-1 font-medium">
            Settled
          </span>
        )}
      </div>

      <div className="text-[9px] md:text-sm">
        {row.nextDueAt
          ? format(new Date(row.nextDueAt), "dd MMM yyyy hh:mm a")
          : "-"}
      </div>

      {/* modern slate checkbox */}
      <div className="text-[9px] md:text-sm">
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={checked}
            onChange={handleToggle}
            disabled={saving}
            aria-checked={checked}
            aria-label={checked ? "Revoke access" : "Grant access"}
          />

          <span
            className={`
      relative h-5 w-5 rounded-sm flex items-center justify-center
      shadow-sm transition
      hover:shadow
      peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2
      peer-disabled:opacity-50
      ${
        checked
          ? "bg-green-500 border-green-500 text-white peer-focus-visible:ring-green-500"
          : "bg-red-500 border-red-500 text-white peer-focus-visible:ring-red-500"
      }
    `}
            aria-hidden="true"
          >
            {checked ? (
              // ✅ granted
              <svg
                className="h-3.5 w-3.5 opacity-100 scale-100 transition-transform transition-opacity duration-200"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              // ❌ denied
              <svg
                className="h-3.5 w-3.5 opacity-100 scale-100 transition-transform transition-opacity duration-200"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6l12 12M6 18L18 6"
                />
              </svg>
            )}
          </span>

          <span
            className={`text-xs md:text-sm ${checked ? "text-green-600" : "text-red-600"}`}
          >
            {checked ? "Granted" : "Denied"}
          </span>
        </label>
      </div>
    </Table.Row>
  );
}

export default AccessControlRow;
