import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { updateLectureStatus } from "@/modules/admin/lecture-links/services/apiLectureLinks";
import toast from "react-hot-toast";
import Modal from "@/modules/shared/components/Modal";
import LectureUpdateForm from "@/modules/admin/lecture-links/components/LectureUpdateForm";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { formatDate, formatTime } from "@/lib/time";
import { getLectureStatus } from "@/lib/lectureStatus";

export function LectureLinkList({
  links,
  courseId,
  onStatusChange,
}: any) {
  //  GROUP BY MONTH
  const grouped = useMemo(() => {
    return links.reduce((acc: any, item: any) => {
      const month = item.month;
      if (!acc[month]) acc[month] = [];
      acc[month].push(item);
      return acc;
    }, {});
  }, [links]);

  const months = Object.keys(grouped);

  //  CURRENT MONTH
  const currentMonth = new Date().toISOString().slice(0, 7);

  const [openMonth, setOpenMonth] = useState(currentMonth);
  const [showHistory, setShowHistory] = useState(false);
  const [now, setNow] = useState(new Date());

  const handleCancel = async (lectureId: string) => {
   
    try {
      await updateLectureStatus(courseId, lectureId, "CANCEL");
      toast.success("Lecture cancelled");
      onStatusChange?.();
    } catch (err) {
      toast.error("Failed to cancel lecture.");
      console.log(err);
    }
  };

  useEffect(() => {
      const id = setInterval(() => {
        setNow(new Date());
      }, 60000);
  
      return () => clearInterval(id);
    }, []);


  //  SPLIT MONTHS
  const pastMonths = months.filter((m) => m < currentMonth);
  const futureMonths = months.filter((m) => m > currentMonth);
  const current = months.filter((m) => m === currentMonth);

  return (
    <div className="space-y-4 mt-5">

      {/* SHOW HISTORY BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowHistory((prev) => !prev)}
          className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>

      {/*  PAST MONTHS (ONLY WHEN ENABLED) */}
      {showHistory &&
        pastMonths.map((month) => (
          <MonthBlock
            key={month}
            month={month}
            isOpen={openMonth === month}
            setOpenMonth={setOpenMonth}
            grouped={grouped}
            courseId={courseId}
            onStatusChange={onStatusChange}
            handleCancel={handleCancel}
          />
        ))}

      {/*  CURRENT MONTH (ALWAYS TOP OF ACTIVE AREA) */}
      {current.map((month) => (
        <MonthBlock
          key={month}
          month={month}
          isOpen={openMonth === month}
          setOpenMonth={setOpenMonth}
          grouped={grouped}
          courseId={courseId}
          onStatusChange={onStatusChange}
          handleCancel={handleCancel}
          highlight
        />
      ))}

      {/*  FUTURE MONTHS (ALWAYS BELOW) */}
      {futureMonths.map((month) => (
        <MonthBlock
          key={month}
          month={month}
          isOpen={openMonth === month}
          setOpenMonth={setOpenMonth}
          grouped={grouped}
          courseId={courseId}
          onStatusChange={onStatusChange}
          handleCancel={handleCancel}
        />
      ))}
    </div>
  );
}

/*  MONTH BLOCK COMPONENT */
function MonthBlock({
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
    <div
      className="bg-white"
    >
      {/* HEADER */}
      <div
        onClick={() => setOpenMonth(isOpen ? "" : month)}
        className="flex justify-between items-center cursor-pointer px-4 py-3 bg-gray-100 hover:bg-gray-200"
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
            const liveStatus = getLectureStatus(lec);
            
                            const isLive = liveStatus === "LIVE";
                            const isScheduled = liveStatus === "SCHEDULED";
                            const isCancelled = liveStatus === "CANCEL";
                            const isCompleted = liveStatus === "COMPLETED";


            return (
              <li
                key={lec.id}
                className={`bg-white border shadow-sm p-4 ${isCancelled ? "opacity-60" : ""
                  }`}
              >
                {/* HEADER */}
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Image src="/meet.png" alt="Google Meet" width={32} height={32} />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{lec.title}</h3>

                    <p className="text-xs text-slate-500 mt-1">
                      📅 {format(new Date(lec.lectureDate), "PPP")}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      ⏰ {formatTime(lec.fromTime)} - {formatTime(lec.toTime)}
                    </p>
                  </div>
                </div>

                {/* STATUS */}
                <div className="mt-3">

                  <span className={cn(
                    "text-[10px] px-2 py-1 rounded-full",
                    isCancelled && "bg-gray-200 text-gray-500",
                    isScheduled && "bg-green-100 text-green-700",
                    isLive && "bg-red-100 text-red-600 animate-pulse",
                    isCompleted && "bg-gray-200 text-gray-500"
                  )}
                  >


                    {liveStatus}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="mt-4 flex gap-2">

                  {/* JOIN */}
                  {!isCancelled && (
                    <Link
                      href={lec.meetingLink}
                      target="_blank"
                      className={cn(
                        "flex-1 text-center text-xs px-3 py-2 cursor-pointer",
                        isLive && "bg-red-600 text-white",
                        isScheduled && "bg-green-600 text-white",
                        isCancelled && "bg-gray-300 text-gray-500",
                        isCompleted && "bg-gray-300 text-gray-500"
                      )}
                    >
                      Join Class
                    </Link>
                  )}

                  {/* EDIT */}
                  <Modal>
                    <Modal.Open opens={`edit-${lec.id}`}>
                      <button className="bg-blue-600 text-white text-xs px-3 py-1 cursor-pointer">
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
                    disabled={lec.status === "CANCEL"}
                    className="bg-red-600 text-white text-xs px-3 py-2"
                  >
                    {lec.status === "CANCEL" ? "Cancelled" : "Cancel"}
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