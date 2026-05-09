"use client";

import { format } from "date-fns";

type Props = {
  attendances: any[];
};

function AttendanceTable({
  attendances,
}: Props) {
  return (
    <div className="overflow-x-auto border bg-white">
      <table className="min-w-full">
        <thead className="bg-gray-100 text-sm font-semibold">
          <tr>
            <th className="p-3 text-left">
              Lecture Title
            </th>

            <th className="p-3 text-left">
              Date
            </th>

            <th className="p-3 text-left">
              Time From
            </th>

            <th className="p-3 text-left">
              Time To
            </th>

            <th className="p-3 text-left">
              Present
            </th>

            <th className="p-3 text-left">
              Marked At
            </th>

            <th className="p-3 text-left">
              Marked User
            </th>
          </tr>
        </thead>

        <tbody className="text-sm border-t ">
          {attendances?.map((item) => {
            const markedUser =
              item.markedBy?.admin
                ? `${item.markedBy.admin.firstName} ${item.markedBy.admin.lastName}`
                : item.markedBy?.instructor
                  ? `${item.markedBy.instructor.firstName} ${item.markedBy.instructor.lastName}`
                  : "-";

            return (
              <tr
                key={item.id}
                className="border-t"
              >
                <td className="p-3">
                  {item.lecture.title}
                </td>

                <td className="p-3">
                  {format(
                    new Date(
                      item.lecture.lectureDate,
                    ),
                    "yyyy-MM-dd",
                  )}
                </td>

                <td className="p-3">
                  {format(
                    new Date(
                      item.lecture.fromTime,
                    ),
                    "hh:mm a",
                  )}
                </td>

                <td className="p-3">
                  {format(
                    new Date(item.lecture.toTime),
                    "hh:mm a",
                  )}
                </td>

                <td className="p-3">

                  <div className={`flex justify-center ${item.present ? "bg-green-600 text-white " : "bg-red-600 text-white"} `}>
                  {item.present
                    ? "Present"
                    : "Absent"}
                </div>
                </td>

                <td className="p-3">
                  {format(
                    new Date(item.markedAt),
                    "yyyy-MM-dd hh:mm a",
                  )}
                </td>

                <td className="p-3">
                  {markedUser}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceTable;