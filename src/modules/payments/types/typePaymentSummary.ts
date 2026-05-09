export type PaymentSummary = {
  courseId: number;
  courseType: {
    id: number;
    name: string;
  };
  photo: string;
  courseFee: number;
  paidTotal: number;
  outstanding: number;
  nextDueAt?: string;
  lastPaymentAt?: string; // ISO
};

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