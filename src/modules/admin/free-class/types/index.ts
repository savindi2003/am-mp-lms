export type ClassType = {
  id: number;
  name: string;
};

export type Instructor = {
  id: number;
  firstName: string;
  lastName: string;
};

export type FreeLecture = {
  id: number;

  title: string;
  description?: string;

  meetingLink: string;

  lectureDate: string;
  fromTime: string;
  toTime: string;

  classType: {
    id: number;
    name: string;
  };

  instructor: {
    id: number;
    firstName: string;
    lastName: string;
  };
};