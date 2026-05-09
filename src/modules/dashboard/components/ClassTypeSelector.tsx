"use client";

export default function ClassTypeSelector({
  classTypes,
  selectedType,
  onSelect,
}: any) {
  return (
    <div className="flex gap-2 flex-wrap">
      {classTypes.map((type: any) => (
        <button
          key={type.id}
          onClick={() => onSelect(type.id)}
          className={`px-4 py-2 border text-sm transition ${
            selectedType === type.id
              ? "bg-slate-800 text-white"
              : "bg-white text-slate-700"
          }`}
        >
          {type.name}
        </button>
      ))}
    </div>
  );
}