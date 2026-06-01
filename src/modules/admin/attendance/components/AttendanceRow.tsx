

export default function AttendanceRow({
  data,
  index,
  students,
  setStudents,
}: any) {
  const toggle = (value: boolean) => {
    const updated = [...students];
    updated[index] = {
      ...updated[index],
      present: value,
    };
    setStudents(updated);
  };

  return (
    <div className="grid md:grid-cols-5 px-4 py-3 border-t items-center">

      <div className="font-medium text-sm">{data.name}</div>

      <div className="text-sm">{data.userId}</div>

      <div className="text-sm">{data.enrollmentNumber}</div>

      {/* STATUS BADGE */}
      <div>
        <span className="text-sm font-semibold"
        >
          {data.present ? "PRESENT" : "ABSENT"}
        </span>
      </div>

      {/* ACTION */}
      <div className="flex gap-2">
        <button
          onClick={() => toggle(true)}
          className={`px-2 py-1 text-sm ${
            data.present
              ? "bg-green-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Present
        </button>

        <button
          onClick={() => toggle(false)}
          className={`px-2 py-1 text-xs ${
            !data.present
              ? "bg-red-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Absent
        </button>
      </div>
    </div>
  );
}