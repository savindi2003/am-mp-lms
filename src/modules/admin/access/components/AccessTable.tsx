
// "use client";

// import { useEffect, useState } from "react";
// import {
//   getAccessList,
//   updateAccess,
// } from "../services/apiAccessControl";
// import Spinner from "@/modules/shared/components/Spinner";
// import Empty from "@/modules/shared/components/Empty";
// import toast from "react-hot-toast";

// export default function AccessTable({ refreshKey }: any) {
//   const [data, setData] = useState<any[]>([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [statusFilter, setStatusFilter] = useState("");
//   const [monthFilter, setMonthFilter] = useState("");

//   const months = [
//     ...new Set(
//       data
//         .map((item: any) => item.month)
//         .filter(Boolean),
//     ),
//   ].sort((a: string, b: string) =>
//     b.localeCompare(a)
//   );

//   const load = async () => {
//     try {
//       setLoading(true);
//       const res = await getAccessList();
//       setData(res || []);
//     } catch (err) {
//       console.error("Load error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // load data
//   useEffect(() => {
//     load();
//   }, [refreshKey]);

//   // status update
//   const handleStatusChange = async (id: number, status: string) => {
//     try {
//       await updateAccess({ id, status });
//       await load();
//       toast.success("Status Updated!");
//     } catch (err) {
//       console.error("Update failed:", err);
//       toast.error("Update failed!");
//     }
//   };

//   // safe search (avoid undefined crash)
//   const filtered = data.filter((item) => {
//     const q = search.toLowerCase();

//     const name =
//       `${item?.student?.firstName ?? ""} ${item?.student?.lastName ?? ""}`.toLowerCase();

//     const nic =
//       item?.student?.user?.NIC?.toLowerCase() ?? "";

//     const matchesSearch =
//       name.includes(q) || nic.includes(q);

//     const matchesStatus =
//       !statusFilter ||
//       item.status === statusFilter;

//     const matchesMonth =
//       !monthFilter ||
//       item.month === monthFilter;

//     return (
//       matchesSearch &&
//       matchesStatus &&
//       matchesMonth
//     );
//   });

//   return (
//     <div className="bg-white p-4 mt-5 space-y-4">

//       <div className="flex flex-col gap-3 md:flex-row md:items-center">

//         {/* SEARCH */}
//         <input
//           value={search}
//           onChange={(e) =>
//             setSearch(e.target.value)
//           }
//           placeholder="Search by name or NIC..."
//           className="input w-full p-2 md:w-80"
//         />

//         {/* STATUS FILTER */}
//         <select
//           value={statusFilter}
//           onChange={(e) =>
//             setStatusFilter(e.target.value)
//           }
//           className="border border-gray-600 px-3 py-2 text-sm"
//         >
//           <option value="">
//             All Status
//           </option>

//           <option value="PAID">
//             PAID
//           </option>

//           <option value="OVERRIDDEN">
//             OVERRIDDEN
//           </option>

//           <option value="REVOKED">
//             REVOKED
//           </option>
//         </select>

//         {/* MONTH FILTER */}
//         {/* MONTH FILTER */}
//         <input
//           type="month"
//           value={monthFilter}
//           onChange={(e) =>
//             setMonthFilter(e.target.value)
//           }
//           className="border px-3 py-2 text-sm w-full md:w-48 border-gray-800"
//         />

//       </div>

//       {/* LOADING */}
//       {loading && (
//         <Spinner />
//       )}

//       {/* TABLE */}
//       <div className="overflow-x-auto">

//         <table className="w-full border text-sm">

//           <thead className="bg-gray-100 text-left">
//             <tr>
//               <th className="p-2">Student</th>
//               <th className="p-2">NIC</th>
//               <th className="p-2">Class</th>
//               <th className="p-2">Month</th>
//               <th className="p-2">Status</th>
//               <th className="p-2">Actions</th>
//             </tr>
//           </thead>

//           <tbody>

//             {filtered.length === 0 && (
//               <tr>
//                 <td colSpan={6} className="p-4 text-center text-gray-500">
//                   No records found
//                 </td>
//               </tr>
//             )}

//             {filtered.map((item) => (
//               <tr key={item.id} className="border-t">

//                 {/* STUDENT */}
//                 <td className="p-2 ">
//                   <div>
//                     {item.student?.firstName} {item.student?.lastName}
//                   </div>

//                   <div className="text-xs text-gray-500">
//                     {item.student?.user?.NIC}
//                   </div>

//                   <span className="inline-block text-[10px] bg-slate-700 text-white px-2 py-0.5 ">
//                     #{item.enrollment?.enrollmentNumber}
//                   </span>
//                 </td>

//                 {/* NIC */}
//                 <td className="p-2">
//                   {item.class.classType.name}
//                 </td>

//                 {/* CLASS */}
//                 <td className="p-2">
//                   {item.class?.description}
//                 </td>

//                 {/* MONTH */}
//                 <td className="p-2">
//                   {item.month}
//                 </td>

//                 {/* STATUS */}
//                 <td className="p-2">
//                   <span
//                     className={`px-2 py-1 rounded-full font-semibold text-[11px] ${item.status === "PAID"
//                       ? "bg-green-100 text-green-700"
//                       : item.status === "OVERRIDDEN"
//                         ? ""
//                         : ""
//                       }`}
//                   >
//                     {item.status}
//                   </span>
//                 </td>

//                 {/* ACTIONS */}
//                 <td className="p-2">


//                   {item.status === "PAID" && (
//                     <span className="text-xs text-gray-400">No actions</span>
//                   )}


//                   {item.status === "OVERRIDDEN" && (
//                     <button
//                       onClick={() => handleStatusChange(item.id, "REVOKED")}
//                       className="px-2 py-1 w-full text-xs text-white  bg-red-500 hover:bg-red-800"
//                     >
//                       REVOKE
//                     </button>
//                   )}


//                   {item.status === "REVOKED" && (
//                     <button
//                       onClick={() => handleStatusChange(item.id, "OVERRIDDEN")}
//                       className="px-2 py-1 text-xs w-full text-white bg-yellow-500 hover:bg-yellow-800"
//                     >
//                       OVERRIDE
//                     </button>
//                   )}

//                 </td>

//               </tr>
//             ))}

//           </tbody>

//         </table>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import {
  getAccessList,
  updateAccess,
} from "../services/apiAccessControl";
import Spinner from "@/modules/shared/components/Spinner";
import Empty from "@/modules/shared/components/Empty";
import toast from "react-hot-toast";

export default function AccessTable({ refreshKey }: any) {
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // button loading state
  const [actionLoadingId, setActionLoadingId] =
    useState<number | null>(null);

  const [statusFilter, setStatusFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");

  const months = [
    ...new Set(
      data
        .map((item: any) => item.month)
        .filter(Boolean),
    ),
  ].sort((a: string, b: string) =>
    b.localeCompare(a)
  );

  const load = async () => {
    try {
      setLoading(true);

      const res = await getAccessList();

      setData(res || []);
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  // load data
  useEffect(() => {
    load();
  }, [refreshKey]);

  // status update
  const handleStatusChange = async (
    id: number,
    status: string
  ) => {
    try {
      setActionLoadingId(id);

      await updateAccess({ id, status });

      await load();

      toast.success("Status Updated!");
    } catch (err) {
      console.error("Update failed:", err);

      toast.error("Update failed!");
    } finally {
      setActionLoadingId(null);
    }
  };

  // filter
  const filtered = data.filter((item) => {
    const q = search.toLowerCase();

    const name =
      `${item?.student?.firstName ?? ""} ${item?.student?.lastName ?? ""}`.toLowerCase();

    const nic =
      item?.student?.user?.userId?.toLowerCase() ?? "";

    const matchesSearch =
      name.includes(q) || nic.includes(q);

    const matchesStatus =
      !statusFilter ||
      item.status === statusFilter;

    const matchesMonth =
      !monthFilter ||
      item.month === monthFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesMonth
    );
  });

  return (
    <div className="bg-white p-4 mt-5 space-y-4">

      <div className="flex flex-col gap-3 md:flex-row md:items-center">

        {/* SEARCH */}
        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search by name or ID..."
          className="input w-full p-2 md:w-80"
        />

        {/* STATUS FILTER */}
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="border border-gray-600 px-3 py-2 text-sm"
        >
          <option value="">
            All Status
          </option>

          <option value="PAID">
            PAID
          </option>

          <option value="OVERRIDDEN">
            OVERRIDDEN
          </option>

          <option value="REVOKED">
            REVOKED
          </option>
        </select>

        {/* MONTH FILTER */}
        <input
          type="month"
          value={monthFilter}
          onChange={(e) =>
            setMonthFilter(e.target.value)
          }
          className="border px-3 py-2 text-sm w-full md:w-48 border-gray-800"
        />

      </div>

      {/* LOADING */}
      {loading && (
        <Spinner />
      )}

      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full border text-sm">

          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Student</th>
              <th className="p-2">ID</th>
              <th className="p-2">Grade</th>
              <th className="p-2">Class</th>
              <th className="p-2">Month</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          </table>

          <div className="max-h-[450px] overflow-y-auto">

            <table className="w-full text-sm">
              <tbody>

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-4 text-center text-gray-500"
                    >
                      No records found
                    </td>
                  </tr>
                )}

                {filtered.map((item) => {

                  const isLoading =
                    actionLoadingId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="border-t"
                    >

                      {/* STUDENT */}
                      <td className="p-2 ">
                        <div>
                          {item.student?.firstName}{" "}
                          {item.student?.lastName}
                        </div>

                        <span className="inline-block text-[10px] bg-slate-700 text-white px-2 py-0.5 ">
                          #{item.enrollment?.enrollmentNumber}
                        </span>
                      </td>

                      <td className="p-2">
                        {item.student?.user?.userId}
                      </td>

                      {/* CLASS TYPE */}
                      <td className="p-2">
                        {item.class.classType.name}
                      </td>

                      {/* CLASS */}
                      <td className="p-2">
                        {item.class?.description}
                      </td>

                      {/* MONTH */}
                      <td className="p-2">
                        {item.month}
                      </td>

                      {/* STATUS */}
                      <td className="p-2">
                        <span
                          className="px-2 py-1 rounded-full font-semibold text-[11px]"

                        >
                          {item.status}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="p-2">

                        {item.status === "PAID" && (
                          <span className="text-xs text-gray-400">
                            No actions
                          </span>
                        )}

                        {item.status === "OVERRIDDEN" && (
                          <button
                            disabled={isLoading}
                            onClick={() =>
                              handleStatusChange(
                                item.id,
                                "REVOKED"
                              )
                            }
                            className="px-2 py-1 w-full text-xs text-white bg-red-500 hover:bg-red-800 disabled:opacity-50"
                          >
                            {isLoading
                              ? "Revoking..."
                              : "REVOKE"}
                          </button>
                        )}

                        {item.status === "REVOKED" && (
                          <button
                            disabled={isLoading}
                            onClick={() =>
                              handleStatusChange(
                                item.id,
                                "OVERRIDDEN"
                              )
                            }
                            className="px-2 py-1 text-xs w-full text-white bg-yellow-500 hover:bg-yellow-800 disabled:opacity-50"
                          >
                            {isLoading
                              ? "Overriding..."
                              : "OVERRIDE"}
                          </button>
                        )}

                      </td>

                    </tr>
                  );
                })}

              </tbody>
            </table>
          </div>

        
      </div>
    </div>
  );
}