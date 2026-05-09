import { useCallback, useEffect, useState } from "react";
import { getCourses as getCoursesApi } from "@/modules/dashboard/services/apiCourse";
import { Course } from "@/modules/shared/types/typeCourse";
import toast from "react-hot-toast";

export function useGetCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const getCourses = useCallback(async () => {
    setCoursesLoading(true);

    try {
      const data = await getCoursesApi();
      setCourses(data);
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : "Failed to fetch courses";
      toast.error(errMsg);
    } finally {
      setCoursesLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    (async () => {
      await getCourses();
    })();
  }, [getCourses]);

  return {
    courses,
    coursesLoading,
    getCourses,
  };
}
