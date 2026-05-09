"use client";

import Modal from "@/modules/shared/components/Modal";
import { Button } from "@/modules/ui/button";
import ConfirmDelete from "@/modules/shared/components/ConfirmDelete";
import { useDeleteCourse } from "@/modules/admin/courses/hooks/useDeleteCourse";
import { useRouter } from "next/navigation";

function CourseDeleteButton({ courseId }: { courseId: number }) {
  const { loading, deleteCourse } = useDeleteCourse();
  const router = useRouter();

  return (
    <Modal>
      <Modal.Open opens="delete-course">
        <Button variant="destructive">Delete</Button>
      </Modal.Open>

      <Modal.Window name="delete-course">
        <ConfirmDelete
          resource="course"
          disabled={loading}
          onConfirm={() => deleteCourse(courseId)}
          onAction={() => router.refresh()}
        />
      </Modal.Window>
    </Modal>
  );
}

export default CourseDeleteButton;
