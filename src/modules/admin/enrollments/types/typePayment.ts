export type Payment = {
  id: number;
  amount: number;
  month: string;
  createdAt: string;
  enrollmentNo: string;
  studentName: string;
  courseName: string;
  enrollmentId: number;
  courseFee: number;
  enrollment?: {
    enrollmentNumber: true;
  };
};
