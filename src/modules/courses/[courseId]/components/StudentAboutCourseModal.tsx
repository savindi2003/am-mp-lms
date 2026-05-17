"use client";

import Modal from "@/modules/shared/components/Modal";
import { Button } from "@/modules/ui/button";
import StudentAboutCourse from "@/modules/courses/[courseId]/components/StudentAboutCourse";
import { CourseAbout } from "@/modules/courses/[courseId]/types/typeCourseAbout";

function StudentAboutCourseModal({ course }: { course: CourseAbout }) {
  return (
    <Modal>
      <Modal.Open opens="create-account-form">
        <Button variant="gray" className="w-full sm:w-auto">About Course</Button>
      </Modal.Open>
      <Modal.Window name="create-account-form">
        <StudentAboutCourse course={course} />
      </Modal.Window>
    </Modal>
  );
}

export default StudentAboutCourseModal;
