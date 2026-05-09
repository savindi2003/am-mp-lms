"use client";

import Table from "@/modules/shared/components/Table";
import { useGetVideoAccessControls } from "@/modules/admin/youtube-videos/[videoId]/access-control/hooks/useGetVideoAccessControls";
import AccessControlRow from "@/modules/admin/youtube-videos/[videoId]/access-control/components/AccessControlRow";
import Spinner from "@/modules/shared/components/Spinner";

type Props = { paramId: { courseId: number; videoId: string } };

function AccessControlTable({ paramId }: Props) {
  const { rows, loading } = useGetVideoAccessControls(
    paramId.courseId,
    paramId.videoId,
  );

  if (loading) return <Spinner />;
  return (
    <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
      <Table>
        <Table.Header styles="hidden md:grid md:grid-cols-[1.2fr_1.2fr_1fr_1fr_0.5fr] items-center gap-x-4 bg-slate-50 px-4 py-3 text-xs font-medium uppercase text-slate-600 sm:text-sm md:text-base">
          <div>Student</div>
          <div>Plan</div>
          <div>Due Amount</div>
          <div>Due Date</div>
          <div>Access</div>
        </Table.Header>

        <Table.Body
          data={rows}
          render={(row) => (
            <AccessControlRow key={row.id} paramId={paramId} row={row} />
          )}
        />
      </Table>
    </div>
  );
}

export default AccessControlTable;
