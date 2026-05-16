"use client";

import { format } from "date-fns";

import { Pencil, Trash2 } from "lucide-react";

type Props = {
  lectures: any[];
  onEdit: (lecture: any) => void;
  onDelete: (id: number) => void;
};

export default function FreeLectureList({
  lectures,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">
        Created Free Classes
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {lectures.map((lecture) => (
          <div
            key={lecture.id}
            className="bg-white border rounded-2xl p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  {lecture.title}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {lecture.classType?.name}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(lecture)}
                  className="w-10 h-10 border rounded-xl flex items-center justify-center"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() =>
                    onDelete(lecture.id)
                  }
                  className="w-10 h-10 border rounded-xl flex items-center justify-center text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-600">
              {lecture.description}
            </p>

            <div className="mt-5 space-y-2 text-sm">
              <p>
                <span className="font-semibold">
                  Instructor:
                </span>{" "}
                {
                  lecture.instructor?.firstName
                }{" "}
                {
                  lecture.instructor?.lastName
                }
              </p>

              <p>
                <span className="font-semibold">
                  Date:
                </span>{" "}
                {format(
                  new Date(
                    lecture.lectureDate
                  ),
                  "PPP"
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}