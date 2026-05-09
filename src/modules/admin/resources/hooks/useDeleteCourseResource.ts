import { useState } from "react";
import { deleteCourseResource as deleteCourseResourceApi } from "@/modules/admin/resources/services/apiCourseResources";
import toast from "react-hot-toast";

export function useDeleteCourseResource(courseId: number) {
  const [loading, setLoading] = useState<boolean>(false);

  async function deleteCourseResource(resourceId: string) {
    setLoading(true);
    const toastId = toast.loading("Deleting course resource...");
    try {
      await deleteCourseResourceApi(courseId, resourceId);
      toast.success("Delete course resource successfully", { id: toastId });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Resource delete failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return { loading, deleteCourseResource };
}
