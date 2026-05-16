import { format, toZonedTime } from "date-fns-tz";

const TIME_ZONE = "Asia/Colombo";

/**
 * Convert DB UTC date → Sri Lanka time (or fixed timezone)
 */
export function formatDateTime(date: string | Date) {
  const zonedDate = toZonedTime(new Date(date), TIME_ZONE);
  return format(zonedDate, "yyyy-MM-dd hh:mm a");
}

/**
 * Only time (for lecture slots)
 */
export function formatTime(date: string | Date) {
  const zonedDate = toZonedTime(new Date(date), TIME_ZONE);
  return format(zonedDate, "hh:mm a");
}

/**
 * Only date
 */
export function formatDate(date: string | Date) {
  const zonedDate = toZonedTime(new Date(date), TIME_ZONE);
  return format(zonedDate, "PPP");
}