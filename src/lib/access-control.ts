import { format } from "date-fns";

export function getMonthAccess({
  dbRecord,
  lectureMonth,
}: {
  dbRecord?: any;
  lectureMonth: string;
}) {
  const currentMonth = new Date().toISOString().slice(0, 7);

  // ❌ no record
  if (!dbRecord) {
    return {
      locked: true,
      showLock: true,
      showReminder: true,
      reason: "NO_PAYMENT",
    };
  }

  // 🟢 admin override
  if (dbRecord.isManuallyOverridden) {
    return {
      locked: false,
      showAdminBadge: true,
      reason: "ADMIN_ACCESS",
    };
  }

  // 💰 paid
  if (dbRecord.activeMonth === lectureMonth) {
    return {
      locked: false,
      reason: "PAID",
    };
  }

  // ❌ fallback
  return {
    locked: true,
    showLock: true,
    reason: "LOCKED",
  };
}