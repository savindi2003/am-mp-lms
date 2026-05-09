export function getMonthAccess(record: any) {
  if (!record) {
    return {
      locked: true,
      reason: "NO_PAYMENT",
    };
  }

  if (record.revokedAt) {
    return {
      locked: true,
      reason: "REVOKED",
    };
  }

  if (record.status === "PAID" || record.status === "OVERRIDDEN") {
    return {
      locked: false,
      reason: record.status,
    };
  }

  return {
    locked: true,
    reason: "LOCKED",
  };
}