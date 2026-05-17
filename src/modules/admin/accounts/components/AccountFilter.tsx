

export default function AccountRoleFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border p-2 text-sm"
    >
      <option value="ALL">All</option>
      <option value="ADMIN">ADMIN</option>
      <option value="INSTRUCTOR">INSTRUCTOR</option>
      <option value="STUDENT">STUDENT</option>
    </select>
  );
}