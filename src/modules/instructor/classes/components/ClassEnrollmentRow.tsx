// src/modules/instructor/classes/components/ClassEnrollmentRow.tsx

import { format } from "date-fns";
import Table from "@/modules/shared/components/Table";
import { ClassEnrollment } from "../types/typeClassEnrollment";
import Modal from "@/modules/shared/components/Modal";
import ShowDetails from "@/modules/shared/components/ShowDetails";
import { FiInfo } from "react-icons/fi";


export default function ClassEnrollmentRow({
  enrollment,
}: {
  enrollment: ClassEnrollment;
}) {
  const name = `${enrollment.student.firstName} ${enrollment.student.lastName}`;
  const nic = enrollment.student.user?.NIC ?? "-";

  return (
    <Table.Row styles="grid grid-cols-6 p-3 text-sm">
      <div>{name}</div>

      <div>{nic}</div>

      <div>
        <span className="bg-slate-600 text-white px-2 py-1 text-xs">
          {enrollment.enrollmentNumber}
        </span>
      </div>

      <div>{format(new Date(enrollment.enrolledAt), "dd MMM yyyy")}</div>

      <div>{enrollment.activeMonth ?? "-"}</div>

      <div className="flex items-center justify-between w-full">
        <span
          className={`px-2 py-1 text-xs ${
            enrollment.enrollmentStatus === "ACTIVE"
              ? "bg-green-200 text-green-700"
              : "bg-red-200 text-red-700"
          }`}
        >
          {enrollment.enrollmentStatus}
        </span>
        

        <div className="ml-auto">
    <Modal>
      <Modal.Open opens={`student-${enrollment.id}`}>
        <button>
          <FiInfo className="text-slate-700 cursor-pointer" />
        </button>
      </Modal.Open>

      <Modal.Window name={`student-${enrollment.id}`}>
        <ShowDetails
          title="Student Details"
          contactNo={enrollment.student.contactNo}
          dob={enrollment.student.dob}
          address={enrollment.student.address}
          guardianContactNo={enrollment.student.guardianContactNo}
          guardianFirstName={enrollment.student.guardianFirstName}
          guardianLastName={enrollment.student.guardianLastName}
          gender={enrollment.student.gender}
          email={enrollment.student.user?.email}
        />
      </Modal.Window>
    </Modal>
  
</div>
      </div>
    </Table.Row>
  );
}