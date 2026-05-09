"use client";
import Table from "@/modules/shared/components/Table";
import OverdueRow from "@/modules/dashboard/components/OverdueRow";
import { DueExpireItem } from "@/modules/dashboard/types/typeDueExpireItem";
import { EnrollmentStatus } from "@prisma/client";

function OverdueTable({
  items,
  updateStatus,
}: {
  items: DueExpireItem[];
  updateStatus: (
    id: number,
    enrollmentStatus: EnrollmentStatus,
  ) => Promise<void>;
}) {
  return (
    <>
      <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
        <Table>
          <Table.Header styles="hidden md:grid md:grid-cols-[1.2fr_1fr_1fr_1fr_1fr_0.5fr] items-center gap-x-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase text-slate-600 sm:text-sm md:text-base">
            <div role="columnheader" className="min-w-0 truncate">
              Student
            </div>
            <div role="columnheader" className="min-w-0 truncate">
              Course
            </div>
            <div role="columnheader" className="min-w-0 truncate">
              Contact
            </div>
            <div role="columnheader" className="min-w-0 truncate">
              Due Amount
            </div>
            <div role="columnheader" className="min-w-0 truncate">
              Due Date
            </div>
            <div role="columnheader" className="min-w-0 truncate">
              Action
            </div>
            <div role="columnheader" className="min-w-0 truncate"></div>
          </Table.Header>
          <Table.Body
            data={items}
            render={(item: DueExpireItem, i) => (
              <OverdueRow item={item} key={i} updateStatus={updateStatus} />
            )}
          ></Table.Body>
        </Table>
      </div>
    </>
  );
}

export default OverdueTable;
