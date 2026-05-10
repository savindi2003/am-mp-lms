"use client";

import Table from "@/modules/shared/components/Table";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { updateAccess } from "../services/apiAccessControl";

export default function StudentAccessRow({ data }: any) {

  type Status = "PAID" | "OVERRIDDEN" | "REVOKED";

  const router = useRouter();

  const changeStatus = async (id: number, status: string) => {
    await updateAccess({ id, status });
    router.refresh();
  };

  //  STATUS STYLE
  const statusStyle: Record<Status, string> = {
  PAID: "bg-green-100 text-green-700",
  OVERRIDDEN: "bg-blue-100 text-blue-700",
  REVOKED: "bg-red-100 text-red-600",
};

  // SINGLE ACTION BUTTON LOGIC
  const getAction = () => {
    if (data.status === "PAID") return null;

    if (data.status === "OVERRIDDEN") {
      return (
        <button
          onClick={() => changeStatus(data.id, "REVOKED")}
          className="bg-black text-white px-3 text-xs py-1 cursor-pointer"
        >
          Revoke
        </button>
      );
    }

    if (data.status === "REVOKED") {
      return (
        <button
          onClick={() => changeStatus(data.id, "OVERRIDDEN")}
          className="bg-black text-white text-xs cursor-pointer px-3 py-1"
        >
          Restore
        </button>
      );
    }

    return null;
  };

  return (
    <Table.Row styles="grid md:grid-cols-6 gap-3 px-4 py-3 items-center border-b">

      {/* STUDENT */}
      <div className="space-y-1">
        <div className="font-medium text-sm text-slate-800">
          {data.student?.firstName} {data.student?.lastName}
        </div>

        <div className="text-xs text-gray-500">
          {data.student?.user?.NIC}
        </div>

        <span className="inline-block text-[10px] bg-slate-700 text-white px-2 py-0.5 ">
          #{data.enrollment?.enrollmentNumber}
        </span>
      </div>

      {/*  CLASS */}
      <div className="space-y-1">
        <div className="font-medium text-xs text-slate-700">
          {data.class?.classType?.name}
        </div>

        <div className="text-xs text-gray-500">
          {data.class?.description}
        </div>
      </div>

      {/*  MONTH */}
      <div className="text-sm text-slate-700 font-medium">
        {data.month}
      </div>

      {/*  REASON */}
      <div className="text-xs text-gray-600 truncate">
        {data.reason || "-"}
      </div>

      {/*  STATUS */}
      <div>
  <span
    className={cn(
      "text-[11px] px-2 py-1 rounded-full font-semibold",
      statusStyle[data.status as Status]
    )}
  >
    {data.status}
  </span>
</div>

      {/*  ACTION */}
      <div className="flex items-center">
        {getAction()}
      </div>

    </Table.Row>
  );
}