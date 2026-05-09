export async function getPayments({
  month,
  page,
}: {
  month: string;
  page: number;
}) {
  const res = await fetch(
    `/api/backend/payments?month=${month}&page=${page}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load payments");
  }

  return res.json();
}