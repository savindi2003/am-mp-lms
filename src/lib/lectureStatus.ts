export function getLectureStatus(lec: {
  fromTime: string | Date;
  toTime: string | Date;
  status?: string;
}) {
  const now = new Date();

  const start = new Date(lec.fromTime);
  const end = new Date(lec.toTime);

  // CANCEL override always
  if (lec.status === "CANCEL") return "CANCEL";

  if (now < start) return "SCHEDULED";
  if (now >= start && now <= end) return "LIVE";
  if (now > end) return "COMPLETED";

  return "SCHEDULED";
}