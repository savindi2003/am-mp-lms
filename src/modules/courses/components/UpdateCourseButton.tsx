"use client";

import Modal from "@/modules/shared/components/Modal";
import { Button } from "@/modules/ui/button";
import { CourseInstructor } from "@/modules/courses/types/typeCourseInstructor";
import UpdateCourseForm from "@/modules/admin/courses/components/UpdateCourseForm";

function UpdateCourseButton({
  instructors,
  courseId,
}: {
  instructors: CourseInstructor[];
  courseId: number;
}) {
  return (
    <Modal>
      <Modal.Open opens="update-course">
        <Button variant="gray">Update</Button>
      </Modal.Open>

      <Modal.Window name="update-course">
        <UpdateCourseForm instructors={instructors} courseId={courseId} />
      </Modal.Window>
    </Modal>
  );
}

export default UpdateCourseButton;
