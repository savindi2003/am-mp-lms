"use client";

import { useState } from "react";
import UploadResourceForm from "@/modules/shared/components/UploadResourceForm";
import CourseResourceList from "@/modules/shared/components/CourseResourceList";
import { useGetCourseResources } from "@/modules/admin/resources/hooks/useGetCourseResources";

function StudentCourseResourceManager({
  courseId,
  userRole,
  isStudentEnrolled = null,
}: {
  courseId: number;
  userRole: string;
  isStudentEnrolled?: null | boolean;
}) {
  const isAdminOrInstructor = userRole === "ADMIN" || userRole === "INSTRUCTOR";

  const { items, getCourseResources, loading } =
    useGetCourseResources(courseId);

  return (
    <div className="space-y-4">

      
      

      {/* ONLY LIST is collapsible */}
      {(isAdminOrInstructor || isStudentEnrolled) && (
        <CourseResourceList
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

export default StudentCourseResourceManager;