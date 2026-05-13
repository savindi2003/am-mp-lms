"use client";

import { useState } from "react";
import UploadResourceForm from "@/modules/shared/components/UploadResourceForm";
import CourseResourceList from "@/modules/shared/components/CourseResourceList";
import { useGetCourseResources } from "@/modules/admin/resources/hooks/useGetCourseResources";
import InstrutorCourseResourceList from "./InstructorCourseResourceList";

function CourseResourceManager({
  courseId,
  userRole,
  isStudentEnrolled = null,
}: {
  courseId: number;
  userRole: string;
  isStudentEnrolled?: null | boolean;
}) {
  const isAdminOrInstructor = userRole === "ADMIN" || userRole === "INSTRUCTOR";
  const isAdmin = userRole === "ADMIN" ;
  const isInstructor = userRole === "INSTRUCTOR";

  const { items, getCourseResources, loading } =
    useGetCourseResources(courseId);

  
  const [showList, setShowList] = useState(false);

  return (
    <div className="space-y-4">

      {/* Upload Form ALWAYS visible */}
      {isAdminOrInstructor && (
        <UploadResourceForm
          courseId={courseId}
          onGetCourseResources={getCourseResources}
        />
      )}

      {/* Header toggle ONLY for list */}
      {(isAdminOrInstructor || isStudentEnrolled) && (
        <div
          onClick={() => setShowList((prev) => !prev)}
          className="flex items-center justify-between cursor-pointer bg-slate-200 hover:bg-slate-300 px-4 py-2 transition"
        >
          <h2 className="text-sm font-semibold text-gray-700">
            View Course Resources admin
          </h2>

          <span className="text-lg">
            {showList ? "▼" : "▶"}
          </span>
        </div>
      )}

      {/* ONLY LIST is collapsible */}
      {showList && (isAdmin || isStudentEnrolled) && (
        <InstrutorCourseResourceList
          courseId={courseId}
          items={items}
          onGetCourseResources={getCourseResources}
          loading={loading}
          isDeleteButton={isAdminOrInstructor}
        />
      )}

      {showList && (isInstructor) && (
        <InstrutorCourseResourceList
          courseId={courseId}
          items={items}
          onGetCourseResources={getCourseResources}
          loading={loading}
          isDeleteButton={isAdminOrInstructor}
        />
      )}

    </div>
  );
}

export default CourseResourceManager;