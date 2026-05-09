import { InstructorEnrollment } from "@/modules/instructor/enrollments/types/typeInstructorEnrollment";
import Table from "@/modules/shared/components/Table";
import { format } from "date-fns";
import { FaMarker } from "react-icons/fa";
import Link from "next/link";
import Modal from "@/modules/shared/components/Modal";
import { FiInfo } from "react-icons/fi";
import ShowDetails from "@/modules/shared/components/ShowDetails";
import * as React from "react";

function InstructorEnrollmentRow({
  enrollment,
  courseId,
}: {
  enrollment: InstructorEnrollment;
  courseId: number;
}) {
  const name =
    `${enrollment.student.firstName ?? ""} ${enrollment.student.lastName ?? ""}`.trim();
  const nic = enrollment.student.user?.NIC ?? "-";
  const enrolled = new Date(enrollment.enrolledAt).toLocaleDateString();

  return (
    <Table.Row styles=" grid grid-rows-2 grid-cols-[1.2fr_1.2fr_1fr] md:grid-rows-1 md:grid-cols-[1.2fr_1fr_1fr_1fr_0.2fr_0.1fr]  grid-rows-1 items-start max-w-6xl">
      <div className="flex flex-col">
        <span className="text-xs md:text-base font-medium text-slate-700">{`${enrollment.student?.firstName} ${enrollment.student?.lastName}`}</span>
      </div>
      <div className=" text-xs md:text-base font-medium text-slate-600">
        {enrollment.student?.user?.NIC}
      </div>

      <div className=" text-[9px] md:text-sm">
        <span className="max-w-[75px] text-xs break-words font-semibold md:max-w-xs md:text-sm bg-slate-500 w-fit text-slate-50 px-1">
          {enrollment.enrollmentNumber}
        </span>
      </div>

      <div className="text-[9px] md:text-sm">
        {format(new Date(enrollment.enrolledAt), "dd MMM yyyy hh:mm a")}
      </div>
      <div className="group flex items-center">
        <Link
          href={`/instructor/courses/${courseId}/enrollments/${enrollment.id}/attendances`}
          className="
          cursor-pointer
          flex items-center
          px-2 py-1
          rounded-sm
          bg-slate-200
          text-slate-700
          text-sm
          transition-all duration-300
          overflow-hidden
          group-hover:px-3
        "
        >
          {/* Icon always visible */}
          <FaMarker className="shrink-0 transition-colors duration-300 group-hover:text-red-400" />

          {/* Text expands only on hover */}
          <span
            className="
            ml-2
            opacity-0
            max-w-0
            overflow-hidden
            transition-all duration-300
            group-hover:opacity-100
            group-hover:max-w-xs
          "
          >
            Record
          </span>
        </Link>
      </div>

      <div className="mt-1 mx-1">
        <Modal>
          <Modal.Open opens="show-student-details">
            <button>
              <FiInfo className="text-slate-700 cursor-pointer ml-auto" />
            </button>
          </Modal.Open>
          <Modal.Window name="show-student-details">
            <ShowDetails
              title="Student Details"
              contactNo={enrollment.student.contactNo}
              dob={enrollment.student.dob}
              address={enrollment.student.address}
              guardianContactNo={enrollment.student.guardianContactNo}
              gender={enrollment.student.gender}
              guardianLastName={enrollment.student.guardianLastName}
              guardianFirstName={enrollment.student.guardianFirstName}
              email={enrollment.student.user?.email}
            />
          </Modal.Window>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default InstructorEnrollmentRow;
