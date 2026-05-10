// import CardBox from "@/modules/shared/components/CardBox";
// import PaymentCard from "@/modules/payments/components/PaymentCard";
// import { getPaymentsSummaryForCurrentUser } from "@/modules/payments/data/action";
// import type { PaymentSummary } from "@/modules/payments/types/typePaymentSummary";

// export default async function PaymentCardList() {
//   const rows: PaymentSummary[] = await getPaymentsSummaryForCurrentUser();
//   if (!rows?.length) {
//     return (
//       <div className="border p-8 text-center">
//         <div className="mx-auto mb-2 h-10 w-10 border" />
//         <h2 className="text-lg font-medium text-slate-800">
//           No enrollments yet
//         </h2>
//         <p className="mt-1 text-sm text-slate-500">
//           When you enroll in a course, your payment summary will appear here.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <CardBox>
//       <CardBox.Item
//         data={rows}
//         render={(row) => <PaymentCard key={row.courseId} row={row} />}
//       />
//     </CardBox>
//   );
// }
