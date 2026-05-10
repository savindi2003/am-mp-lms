// import { CreatePaymentFormData } from "../validators/createPaymentSchema";

// export async function createAdminPayment(payload: CreatePaymentFormData) {
//   const res = await fetch("/api/backend/admin/payments", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data.error || "Failed to create payment");
//   }

//   return data;
// }