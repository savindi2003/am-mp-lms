export type CourseAbout = {
  photo: string | null;
  courseType: string | undefined;
  description: string | null;
  instructor: {
    firstName: string;
    lastName: string;
    title: string;
    user: { photo: string | null };
  } | null;
};
