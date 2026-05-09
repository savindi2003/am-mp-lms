export type StudentPaymentRow = {
  paymentId: number;
  enrollmentId: number;
  classTypeName: string;
  classDescription: string;
  month: string;
  paidAmount: number;
  paidAt: string;
  receiptKey?: string | null;
};