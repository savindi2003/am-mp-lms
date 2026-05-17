export default function AccountSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search name or email..."
      className="border p-2 w-full max-w-lg"
    />
  );
}