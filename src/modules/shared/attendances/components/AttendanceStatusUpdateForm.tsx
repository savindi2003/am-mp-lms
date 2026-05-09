import { Button } from "@/modules/ui/button";
import toast from "react-hot-toast";

function AttendanceStatusUpdateForm({
  onStatus,
  status,
  loading,
  weekSaving,
  createAttendance,
  getAttendances,
}: {
  onStatus: (status: string) => void;
  status: string;
  loading: boolean;
  weekSaving: boolean;
  createAttendance: (status: "true" | "false") => Promise<void>;
  getAttendances: () => Promise<void>;
}) {
  return (
    <form className="flex gap-3 ml-auto w-fit my-5">
      <div className="flex items-center gap-2 ml-auto w-fit">
        <p>Status:</p>
        <select
          value={status}
          onChange={(e) => onStatus(e.target.value)}
          className="border px-2 py-1 text-sm"
        >
          <option value="" className="bg-slate-600 text-slate-200">
            Select status
          </option>
          <option value="true">Present</option>
          <option value="false">Absent</option>
        </select>
      </div>
      <Button
        disabled={loading || weekSaving}
        onClick={async (e) => {
          e.preventDefault();
          if (status === "") return toast.error("Please Select a status");
          await createAttendance(status as "true" | "false");
          await getAttendances();
        }}
      >
        Update
      </Button>
    </form>
  );
}

export default AttendanceStatusUpdateForm;
