"use client";

export default function ClassSelector({
  classes,
  selected,
  setSelected,
}: any) {
  const toggle = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((c: number) => c !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <div className="grid gap-2">
      {classes.map((c: any) => {
        const isActive = selected.includes(c.id);

        return (
          <div
            key={c.id}
            onClick={() => toggle(c.id)}
            className={`
              cursor-pointer border p-3 transition flex items-center justify-between
              hover:shadow-sm select-none
              ${
                isActive
                  ? "border-black bg-gray-50"
                  : "border-gray-200 bg-white"
              }
            `}
          >
            {/* LEFT SIDE */}
            <div className="flex items-center gap-3">

              {/* checkbox UI */}
              <div
                className={`
                  w-4 h-4 border rounded-xs flex items-center justify-center
                  ${
                    isActive
                      ? "border-black bg-black"
                      : "border-gray-400 bg-white"
                  }
                `}
              >
                {isActive && (
                  <span className="text-white text-[10px]">✓</span>
                )}
              </div>

              <div>
                <div className="text-sm font-medium text-gray-800">
                  {c.description}
                </div>

                <div className="text-xs text-gray-500">
                  Class fee applied per month
                </div>
              </div>
            </div>

            {/* RIGHT SIDE PRICE */}
            <div
              className={`
                text-sm font-semibold
                ${isActive ? "text-black" : "text-gray-700"}
              `}
            >
              Rs. {c.classFee}
            </div>
          </div>
        );
      })}
    </div>
  );
}