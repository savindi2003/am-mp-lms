import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { attendanceUpdateFormSchema } from "@/modules/shared/attendances/validators/attendanceUpdateFormSchema";
import { useUpdateAttendance } from "@/modules/shared/attendances/hooks/useUpdateAttendance";

type Props = {
  enrollmentId: number;
  attendanceId: number;
  defaultValues?: {
    present: boolean;
    weekNo: number;
  };
  onCloseModal?: () => void;
  onSuccess?: () => void;
  weekNo: number;
  present: boolean;
};

function AttendanceUpdateForm({
  onCloseModal,
  enrollmentId,
  attendanceId,
  defaultValues,
  weekNo,
  present,
  onSuccess,
}: Props) {
  const { loading, updateAttendance } = useUpdateAttendance(enrollmentId);

  const form = useForm({
    resolver: zodResolver(attendanceUpdateFormSchema),
    defaultValues: {
      present: present ? "true" : "false",
      weekNo: weekNo ?? 1,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await updateAttendance(attendanceId, values.present, values.weekNo);
    onSuccess?.();
    onCloseModal?.();
  });

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Status</label>
        <select
          className="rounded border px-3 py-2 text-sm"
          {...register("present")}
        >
          <option value="true">Present</option>
          <option value="false">Absent</option>
        </select>
        {errors.present && (
          <p className="text-xs text-red-600">{errors.present.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Week No</label>
        <input
          type="number"
          min={1}
          className="w-32 rounded border px-3 py-2 text-sm"
          {...register("weekNo", { valueAsNumber: true })}
        />
        {errors.weekNo && (
          <p className="text-xs text-red-600">{errors.weekNo.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Updating…" : "Update"}
      </button>
    </form>
  );
}

export default AttendanceUpdateForm;
