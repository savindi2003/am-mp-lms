"use client";

export default function ClassFilter({
  classTypes,
  onChange,
}: any) {
  return (
    <select
      className="border p-2 mb-4"
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="ALL">All Classes</option>

      {classTypes.map((t: any) => (
        <option key={t.id} value={t.name}>
          {t.name}
        </option>
      ))}
    </select>
  );
}