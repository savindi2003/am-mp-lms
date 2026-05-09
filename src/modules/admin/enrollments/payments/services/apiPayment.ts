export async function deleteAdminPayment(
  enrollmentId: number,
  paymentId: number,
) {
  const res = await fetch(
    `/api/backend/admin/enrollments/${enrollmentId}/payments/${paymentId}`,
    {
      method: "DELETE",
    },
  );
  if (!res.ok) throw new Error("Failed to get Enrollments");
}

export async function getPaymentsByEnrollment(enrollmentId: number) {
  const res = await fetch(
    `/api/backend/admin/enrollments/${enrollmentId}/payments`,
    {
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error("Failed to fetch enrollments");
  return res.json();
}
