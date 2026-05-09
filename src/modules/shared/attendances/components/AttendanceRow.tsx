import Table from "@/modules/shared/components/Table";
import ConfirmDelete from "@/modules/shared/components/ConfirmDelete";
import Menus from "@/modules/shared/components/Menus";
import Modal from "@/modules/shared/components/Modal";
import { HiPencilSquare, HiTrash } from "react-icons/hi2";
import { format } from "date-fns";
import { useGetUserById } from "@/modules/shared/attendances/hooks/useGetUserById";
import { AttendanceType } from "@/modules/shared/attendances/types/typeAttendance";
import AttendanceUpdateForm from "@/modules/shared/attendances/components/AttendanceUpdateForm";

function AttendanceRow({
  attendance,
  deleteAttendance,
  deleteLoading,
  getAttendances,
  enrollmentId,
}: {
  attendance: AttendanceType;
  deleteAttendance: (attendanceId: number) => Promise<void>;
  deleteLoading: boolean;
  getAttendances: () => Promise<void>;
  enrollmentId: number;
}) {
  const { user } = useGetUserById(attendance.markedByUserId);

  return (
    <div>
      <Table.Row styles=" grid grid-rows-2 grid-cols-[1fr_1fr_1fr] md:grid-rows-1 md:grid-cols-[1fr_1fr_1fr_1fr_0.2fr] grid-rows-1 items-start">
        <div className=" text-xs md:text-base font-medium text-slate-600">
          {attendance.lecture.title}
        </div>
        <div
          className={`text-xs md:text-sm font-medium w-fit px-1 ${attendance.present ? "bg-green-500 text-green-50" : "bg-red-500 text-red-50"}`}
        >
          {attendance.present ? "Present" : "Absent"}
        </div>
        <div className="flex flex-col">
          <span className="text-xs md:text-base font-medium text-slate-700">
            {" "}
            {user?.admin
              ? `${user.admin.firstName} ${user.admin.lastName}`
              : `${user?.instructor.firstName ? user.instructor.firstName : ""} ${user?.instructor.lastName ? user.instructor.lastName : ""}`}
          </span>
          {/*<span className="max-w-[75px] text-xs break-words text-slate-500 font-semibold md:max-w-xs md:text-sm">*/}
          {/*  {attendance.enrollment.student.user.NIC}*/}
          {/*</span>*/}
          <span className="max-w-[75px] text-xs break-words text-slate-500 font-semibold md:max-w-xs md:text-sm">
            {user?.admin ? "Admin" : "Instructor"}
          </span>{" "}
        </div>

        <div className="text-[9px] md:text-sm">
          {format(new Date(attendance.markedAt), "dd MMM yyyy hh:mm a")}
        </div>
        
      </Table.Row>
    </div>
  );
}

export default AttendanceRow;
