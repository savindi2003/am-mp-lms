"use client";

import { Button } from "@/modules/ui/button";
import Modal from "@/modules/shared/components/Modal";
import CreateCourseForm from "@/modules/admin/courses/components/CreateCourseForm";
import { CourseInstructor } from "@/modules/courses/types/typeCourseInstructor";
import CreateClassForm from "@/modules/admin/courses/components/CreateClassForm";

export default function CreateClassButton({
  instructors,
}: {
  instructors: CourseInstructor[];
}) {
  return (
    <Modal>
      <Modal.Open opens="create-class">
        <Button>Create Class</Button>
      </Modal.Open>

      <Modal.Window name="create-class">
        <CreateClassForm instructors={instructors} />
      </Modal.Window>
    </Modal>
  );
}
