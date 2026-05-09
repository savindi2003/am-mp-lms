export type LectureStatus =
  | "SCHEDULED"
  | "LIVE"
  | "COMPLETED"
  | "CANCEL";

export type CourseLectureLink = {
  id: string;
  courseId: number;
  title: string;
  meetingLink: string;
  lectureDate: string;
  fromTime: string;
  toTime: string;
  status: LectureStatus;
  uploadedByUserId: number;
  createdAt: string;
  updatedAt: string;
  month:string;
};

export type CourseLectureLinkResponse = {
  lectures: CourseLectureLink[];
  accessMap: Record<
    string,
    {
      status: "PAID" | "OVERRIDDEN" | "REVOKED";
      reason?: string;
    } | null
  >;
};