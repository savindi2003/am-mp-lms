export type InstructorCourse = {
  id: number;
  photo: string | null;
  classFee: number;
  description: string;
  month: string | null;

  classType: {
    id: number;
    name: string;
  };

  instructor: {
    id: number;
    firstName: string;
    lastName: string;
    title: string;
  };

  _count: {
    enrollments: number;
    courseYoutubeVideo: number;
    courseResource: number;
  };
};

