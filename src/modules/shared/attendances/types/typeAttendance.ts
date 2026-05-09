export type AttendanceType = {
  id: number;
  lectureId: number;
  present:boolean;
  enrollmentId: number;
  markedAt: string;
  markedByUserId: number;
  
  enrollment: {
    enrollmentNumber: string;
    student: {
      firstName: string;
      lastName: string;
      user: {
        NIC: string;
      };
    };
  };
  lecture:{
    id:number;
    title:string;
    lectureDate:string;
    fromTime:string;
    toTime:string;
  }
};
