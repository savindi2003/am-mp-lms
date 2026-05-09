import Table from "@/modules/shared/components/Table";
import { DueExpireItem } from "@/modules/dashboard/types/typeDueExpireItem";
import { formatCurrency, getCourseName } from "@/modules/shared/utils/helper";
import { format } from "date-fns";
import { EnrollmentStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import Modal from "@/modules/shared/components/Modal";
import ShowDetails from "@/modules/shared/components/ShowDetails";
import { FiInfo } from "react-icons/fi";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";

function OverdueRow({
  item,
  updateStatus,
}: {
  item: DueExpireItem;
  updateStatus: (
    id: number,
    enrollmentStatus: EnrollmentStatus,
  ) => Promise<void>;
}) {
  const router = useRouter();
  const isActive = item.enrollmentStatus === "ACTIVE";

  const toastId = useRef("");

  useEffect(() => {
    if (!toastId.current) return;
    toast.success("Saved!", { id: toastId.current });
  }, [isActive]);

  async function handleStatus() {
    toastId.current = toast.loading("Saving...");
    if (isActive) {
      await updateStatus(item.id, "DROPPED");
      router.refresh();
    } else {
      await updateStatus(item.id, "ACTIVE");
      router.refresh();
    }
  }

  console.log(item.courseType.name);
  return (
    <Table.Row styles=" grid grid-rows-2 grid-cols-[1.2fr_1.2fr_1fr] md:grid-rows-1 md:grid-cols-[1.2fr_1fr_1fr_1fr_1fr_0.5fr] items-center gap-x-4 text-xs font-medium uppercase text-slate-600 sm:text-sm md:text-base">
      <div className="flex flex-col">
        <span className="text-xs md:text-base font-medium text-slate-700">
          {item.name}
        </span>
        <span className="max-w-[75px] text-xs break-words text-slate-500 font-semibold md:max-w-xs md:text-sm">
          {item.nic}
        </span>
        <span className="max-w-[75px] text-xs break-words font-semibold md:max-w-xs md:text-sm bg-slate-500 w-fit text-slate-50 px-1">
          {item.enrollmentNumber}
        </span>{" "}
      </div>
      <div className="text-xs md:text-base font-medium text-slate-600">
        {getCourseName(item.courseType.name)}
      </div>
      <div className="text-xs md:text-base font-medium text-slate-600">
        {item.contactNo}
      </div>
      <div className="text-red-50 bg-red-500 w-fit px-1 font-medium">
        {formatCurrency(item.dueAmount)}
      </div>

      <div className="text-sm font-medium text-slate-600">
        {format(new Date(item.dueDate), "dd MMM yyyy hh:mm a")}
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleStatus}
          className={`text-sm shadow-lg rounded-sm px-1 w-fit cursor-pointer ${isActive ? "bg-green-500 text-green-50" : "bg-red-500 text-red-50"}`}
        >
          {item.enrollmentStatus}
        </button>
        <Modal>
          <Modal.Open opens="show-student-details">
            <button
              type="button"
              className="block w-full text-left text-sm hover:rounded-none hover:bg-transparent hover:text-red-400"
            >
              <FiInfo className="text-slate-700 cursor-pointer" size={17} />
            </button>
          </Modal.Open>
          <Modal.Window name="show-student-details">
            <ShowDetails
              title="Enrollment Details"
              courseDay={item.courseDay}
              contactNo={item.contactNo}
              guardianContactNo={item.guardianContactNo}
              guardianFirstName={item.guardianFirstName}
              guardianLastName={item.guardianLastName}
              email={item.email}
              dob={item.dob}
              address={item.address}
              gender={item.gender}
              createdAt={item.enrolledAt}
            />
          </Modal.Window>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default OverdueRow;
