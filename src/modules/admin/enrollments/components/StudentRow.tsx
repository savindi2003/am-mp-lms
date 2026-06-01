"use client";

import Table from "@/modules/shared/components/Table";
import Modal from "@/modules/shared/components/Modal";
import Menus from "@/modules/shared/components/Menus";

import {
  HiOutlineBanknotes,
  HiOutlineUser,
  HiTrash,
} from "react-icons/hi2";

import { FiInfo } from "react-icons/fi";
import { useRouter } from "next/navigation";

import ConfirmDelete from "@/modules/shared/components/ConfirmDelete";
import ShowDetails from "@/modules/shared/components/ShowDetails";

import { useDeleteEnrollment } from "../hooks/useDeleteEnrollment";
import { useUpdateEnrollmentStatus } from "../hooks/useUpdateEnrollmentStatus";

import { format } from "date-fns";

export default function StudentRow({
  enrollment,
  onGetEnrollments,
}: any) {
  const router = useRouter();

  const { deleteEnrollment } = useDeleteEnrollment();
  const { updateEnrollmentStatus } = useUpdateEnrollmentStatus();

  const isPaid =
    enrollment.activeMonth === new Date().toISOString().slice(0, 7);

  const isActive = enrollment.enrollmentStatus === "ACTIVE";

  async function handleStatus() {
    await updateEnrollmentStatus(
      enrollment.id,
      isActive ? "DROPPED" : "ACTIVE"
    );
    await onGetEnrollments();
  }

  return (
    <Table.Row styles="grid md:grid-cols-7 px-4 py-3 items-center">

      {/* STUDENT */}
      <div>
        <div className="font-medium text-sm">
          {enrollment.student?.firstName} {enrollment.student?.lastName}
        </div>
        <div className="text-xs text-gray-500">
          {enrollment.student?.user?.userId}
        </div>
        <span className="text-[10px] bg-slate-800 text-white px-1 w-fit mt-1">
          {enrollment.enrollmentNumber}
        </span>
      </div>

      
      <div className="text-sm text-gray-700">
  {enrollment.class?.classType?.name || "-"}
</div>

      <div className="text-sm text-gray-700">
        {enrollment.class?.description}
      </div>


      {/* PAID STATUS */}
      <div>
        {isPaid ? (
          <span className="text-green-600 text-xs font-medium">
            PAID
          </span>
        ) : (
          <span className="text-red-500 text-xs font-medium">
            NOT PAID
          </span>
        )}
      </div>

      {/* ACTIVE MONTH */}
      <div className="text-sm">
        {enrollment.activeMonth || "-"}
      </div>

      {/* ENROLLED DATE */}
      <div className="text-xs">
        {format(new Date(enrollment.enrolledAt), "dd MMM yyyy")}
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2">

        {/* STATUS TOGGLE */}
        <button
          onClick={handleStatus}
          className="text-xs px-2 py-1 border"
        >
          {isActive ? "Active" : "Dropped"}
        </button>

        <Modal>
          <Menus>
            <Menus.Toggle id={enrollment.id.toString()} />

            <Menus.List id={enrollment.id.toString()}>

              {/* PAYMENTS */}
              <Menus.ButtonMenu
              
                icon={<HiOutlineBanknotes size={16} />} 
                variant="menu"
                onClick={() =>
                  router.push(
                    `/admin/enrollments/${enrollment.id}/payments`
                  )
                }
              >
                Payments
              </Menus.ButtonMenu>

              {/*  ATTENDANCE */}
              <Menus.ButtonMenu
                icon={<HiOutlineUser size={16} />}
                variant="menu"
                onClick={() =>
                  router.push(
                    `/admin/enrollments/${enrollment.id}/attendances`
                  )
                }
              >
                Attendance
              </Menus.ButtonMenu>

              {/*  DETAILS */}
              <Modal.Open opens="details">
                <Menus.ButtonMenu icon={<FiInfo size={16} />} variant="menu">
                  See Details
                </Menus.ButtonMenu>
              </Modal.Open>

              {/* 🗑 DELETE */}
              <Modal.Open opens="delete">
                <Menus.ButtonMenu icon={<HiTrash size={16} />} variant="menu">
                  Delete
                </Menus.ButtonMenu>
              </Modal.Open>

            </Menus.List>

            {/* DELETE MODAL */}
            <Modal.Window name="delete">
              <ConfirmDelete
                resource="enrollment"
                onConfirm={async () => {
                  await deleteEnrollment(enrollment.id);
                  await onGetEnrollments();
                }}
              />
            </Modal.Window>

            {/* DETAILS MODAL */}
            <Modal.Window name="details">
              <ShowDetails
                title="Enrollment Details"
                contactNo={enrollment.student?.contactNo}
                address={enrollment.student?.address}
                dob={enrollment.student?.dob}
                gender={enrollment.student?.gender}
                guardianContactNo={enrollment.student?.guardianContactNo}
                guardianFirstName={
                  enrollment.student?.guardianFirstName
                }
                guardianLastName={
                  enrollment.student?.guardianLastName
                }
                email={enrollment.student?.user?.email}
                createdAt={enrollment.enrolledAt}
              />
            </Modal.Window>

          </Menus>
        </Modal>

      </div>
    </Table.Row>
  );
}