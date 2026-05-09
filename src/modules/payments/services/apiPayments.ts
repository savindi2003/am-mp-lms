import { cookies } from "next/headers";

export type PaymentSummary = {
  courseId: number;
  courseName: string;
  courseCode: number | string;
  coursePhoto: string;
  courseFee: number;
  paidTotal: number;
  outstanding: number;
  lastPaymentAt?: string; // ISO
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export async function getPaymentsSummary(): Promise<PaymentSummary[]> {
  const res = await fetch(`${BASE_URL}/api/backend/payments/summary`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies().toString(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to fetch payments summary: ${res.status} ${msg}`);
  }

  return res.json();
}
