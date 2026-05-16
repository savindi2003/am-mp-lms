import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import Modal from "@/modules/shared/components/Modal";
import LectureUpdateForm from "@/modules/admin/lecture-links/components/LectureUpdateForm";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/time";
import { getLectureStatus } from "@/lib/lectureStatus";

export default function MonthBlock({
  month,
  isOpen,
  setOpenMonth,
  grouped,
  courseId,
  onStatusChange,
  handleCancel,
  highlight,
}: any) {
  return (
    <div className="bg-white">

      {/* HEADER */}
      <div
        onClick={() => setOpenMonth(isOpen ? "" : month)}
        className="flex justify-between items-center cursor-pointer px-4 py-3 bg-gray-100"
      >
        <h2 className="font-semibold text-sm">
          📅 {month} {highlight && "(Current)"}
        </h2>
        <span>{isOpen ? "▼" : "▶"}</span>
      </div>

      {/* CONTENT */}
      {isOpen && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {grouped[month].map((lec: any) => {
            const status = getLectureStatus(lec);

            const isLive = status === "LIVE";
            const isScheduled = status === "SCHEDULED";
            const isCancelled = status === "CANCEL";
            const isCompleted = status === "COMPLETED";

            return (
              <li
                key={lec.id}
                className={cn(
                  "bg-white border shadow-sm p-4",
                  isCancelled && "opacity-60"
                )}
              >
                {/* HEADER */}
                <div className="flex items-start gap-3">
                  <Image src="/meet.png" alt="meet" width={32} height={32} />

                  <div>
                    <h3 className="font-semibold text-sm">{lec.title}</h3>

                    <p className="text-xs text-gray-500">
                      📅 {format(new Date(lec.lectureDate), "PPP")}
                    </p>

                    <p className="text-xs text-gray-500">
                      ⏰ {formatTime(lec.fromTime)} - {formatTime(lec.toTime)}
                    </p>
                  </div>
                </div>

                {/* STATUS */}
                <div className="mt-3">
                  <span className="text-[10px] px-2 py-1 rounded bg-gray-200">
                    {status}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="mt-4 flex gap-2">

                  <Link
                    href={lec.meetingLink}
                    target="_blank"
                    className={cn(
                      "flex-1 text-center text-xs py-2",
                      isLive && "bg-red-600 text-white",
                      isScheduled && "bg-green-600 text-white",
                      isCompleted && "bg-gray-300",
                      isCancelled && "bg-gray-300"
                    )}
                  >
                    Join Class
                  </Link>

                  {/* EDIT */}
                  <Modal>
                    <Modal.Open opens={`edit-${lec.id}`}>
                      <button className="bg-blue-600 text-white text-xs px-3 py-1">
                        Edit
                      </button>
                    </Modal.Open>

                    <Modal.Window name={`edit-${lec.id}`}>
                      <LectureUpdateForm
                        lecture={lec}
                        courseId={courseId}
                        onSuccess={onStatusChange}
                      />
                    </Modal.Window>
                  </Modal>

                  {/* CANCEL */}
                  <button
                    onClick={() => handleCancel(lec.id)}
                    disabled={isCancelled}
                    className="bg-red-600 text-white text-xs px-3 py-2 disabled:opacity-50"
                  >
                    {isCancelled ? "Cancelled" : "Cancel"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}