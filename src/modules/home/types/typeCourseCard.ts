export type CourseCardType = {
  id: number;
  // courseType: "GRAPHIC_DESIGNING" | "VIDEO_EDITING";
  photo: string;
  description: string;
  courseType: string;
  instructor: {
    firstName: string;
    lastName: string;
    title: string;
    user: {
      photo: string | null;
    };
  };
};
