"use client";

export default function PackageSelector({
  packages,
  selected,
  setSelected,
}: any) {
  return (
    <div className="grid gap-2">
      {packages.map((p: any) => {
        const isActive = selected === p.id;

        return (
          <div
            key={p.id}
            onClick={() => setSelected(p)}
            className={`
              cursor-pointer border p-3 transition flex items-center justify-between
              hover:shadow-sm select-none
              ${
                isActive
                  ? "border-black bg-white shadow"
                  : "border-gray-200 bg-white"
              }
            `}
          >
            {/* LEFT SIDE */}
            <div className="flex items-center gap-3">

              {/* checkbox */}
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
                  {p.name}
                </div>

                <div className="text-xs text-gray-500 mt-0.5">
                  Includes all class access in this package
                </div>
              </div>
            </div>

            {/* RIGHT SIDE PRICE */}
            <div className="text-sm font-semibold text-gray-700">
              Rs. {p.totalFee}
            </div>
          </div>
        );
      })}
    </div>
  );
}