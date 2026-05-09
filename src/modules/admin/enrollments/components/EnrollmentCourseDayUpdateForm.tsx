"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/modules/ui/button";
import {
  updateEnrollmentCourseDaySchema,
  updateEnrollmentCourseDaySchemaFormData,
} from "@/modules/admin/enrollments/validators/updateEnrollmentCourseDay";
import { useUpdateEnrollmentCourseDay } from "@/modules/admin/enrollments/hooks/useUpdateEnrollmentCourseDay"; // ✅ added

function EnrollmentCourseDayUpdateForm({
  enrollmentId, // added
  currentCourseDay,
  availableDays,
  onCloseModal,
  onGetEnrollments,
}: {
  enrollmentId: number; //  added
  currentCourseDay: string;
  onCloseModal?: () => void;
  availableDays: { day: string; id: number }[] | undefined;
  onGetEnrollments: () => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError, // to set a field error if day not found
  } = useForm<updateEnrollmentCourseDaySchemaFormData>({
    resolver: zodResolver(updateEnrollmentCourseDaySchema),
  });

  const { loading, updateEnrollmentCourseDay } = useUpdateEnrollmentCourseDay(); //  hook

  const onSubmit = async (data: updateEnrollmentCourseDaySchemaFormData) => {
    const match = availableDays?.find((d) => d.day === data.selectedDay);
    if (!match) {
      setError("selectedDay", {
        type: "validate",
        message: "Please select a valid day",
      });
      return;
    }
    await updateEnrollmentCourseDay(enrollmentId, match.id); //  call hook
    onCloseModal?.();
    await onGetEnrollments();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 m-5">
      <div className="flex gap-2">
        <span className="text-sm">Current Course Day: </span>
        <span className="bg-slate-500 text-slate-50 px-1 text-sm font-semibold">
          {currentCourseDay}
        </span>
      </div>

      <div>
        <label className="block mb-1 text-sm">Available Days:</label>
        <select
          {...register("selectedDay")}
          defaultValue=""
          className="w-full border p-2 text-sm"
        >
          <option value="" disabled>
            -- Select a Day --
          </option>
          {availableDays?.map((d, index) => (
            <option key={index} value={d.day}>
              {d.day}
            </option>
          ))}
        </select>
        {errors.selectedDay && (
          <p className="text-red-600 text-sm mt-1">
            {errors.selectedDay.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        {onCloseModal && (
          <Button type="button" variant="outline" onClick={onCloseModal}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="gray" disabled={isSubmitting || loading}>
          {isSubmitting || loading ? "Updating..." : "Update"}
        </Button>
      </div>
    </form>
  );
}

export default EnrollmentCourseDayUpdateForm;
