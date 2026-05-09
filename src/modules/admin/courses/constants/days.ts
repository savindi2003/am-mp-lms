export const DAY_VALUES = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

export type Day = (typeof DAY_VALUES)[number];

export const DAY_LABEL: Record<Day, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

export const COURSE_TYPE_VALUES = [
  "VIDEO_EDITING",
  "GRAPHIC_DESIGNING",
] as const;
export type CourseType = (typeof COURSE_TYPE_VALUES)[number];

export const COURSE_TYPE_LABEL: Record<CourseType, string> = {
  VIDEO_EDITING: "Video Editing",
  GRAPHIC_DESIGNING: "Graphic Designing",
};
