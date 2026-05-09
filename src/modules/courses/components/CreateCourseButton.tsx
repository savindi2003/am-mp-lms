"use client";

import { Button } from "@/modules/ui/button";
import Modal from "@/modules/shared/components/Modal";
import CreateCourseForm from "@/modules/admin/courses/components/CreateCourseForm";
import { CourseInstructor } from "@/modules/courses/types/typeCourseInstructor";

export default function CreateCourseButton({
  instructors,
}: {
  instructors: CourseInstructor[];
}) {
  return (
    <Modal>
      <Modal.Open opens="create-course">
        <Button>Create Course</Button>
      </Modal.Open>

      <Modal.Window name="create-course">
        <CreateCourseForm instructors={instructors} />
      </Modal.Window>
    </Modal>
  );
}
