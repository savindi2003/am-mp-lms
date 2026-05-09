"use client";

import { useMemo, useState } from "react";
import type { YoutubeLinkRow } from "../../admin/youtube-videos/types/typeYoutubeLink";
import Modal from "@/modules/shared/components/Modal";
import ConfirmDelete from "@/modules/shared/components/ConfirmDelete";
import Menus from "@/modules/shared/components/Menus";
import { HiCog6Tooth, HiTrash } from "react-icons/hi2";
import { useDeleteLink } from "@/modules/admin/youtube-videos/hooks/useDeleteLink";
import { useRouter } from "next/navigation";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { format } from "date-fns";

type Props = {
  links: YoutubeLinkRow[];
  courseId: number;
  onSetVisibility: (
    id: string,
    visibility: "PUBLISHED" | "HIDDEN"
  ) => Promise<void>;
  getLinks: () => Promise<void>;
  isAdmin: boolean;
};

export function YoutubeLinkList({
  links,
  onSetVisibility,
  courseId,
  getLinks,
  isAdmin,
}: Props) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const { onDeleteLink, loading: deleteLoading } = useDeleteLink(courseId);
  const router = useRouter();

  //  GROUP BY MONTH
  const grouped = useMemo(() => {
    return links.reduce((acc: any, item: any) => {
      const month = item.month || "Unknown";
      if (!acc[month]) acc[month] = [];
      acc[month].push(item);
      return acc;
    }, {});
  }, [links]);

  const months = Object.keys(grouped);

  //  CURRENT MONTH
  const currentMonth = new Date().toISOString().slice(0, 7);

  const [openMonth, setOpenMonth] = useState(currentMonth);
  const [showHistory, setShowHistory] = useState(false);

  if (!links?.length)
    return <p className="text-sm text-slate-500">No videos yet.</p>;

  const pastMonths = months.filter((m) => m < currentMonth);
  const futureMonths = months.filter((m) => m > currentMonth);
  const current = months.filter((m) => m === currentMonth);

  return (
    <div className="space-y-4">

      {/* HISTORY BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowHistory((prev) => !prev)}
          className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>

      {/*  PAST MONTHS */}
      {showHistory &&
        pastMonths.map((month) => (
          <MonthBlock
            key={month}
            month={month}
            items={grouped[month]}
            openMonth={openMonth}
            setOpenMonth={setOpenMonth}
            isAdmin={isAdmin}
            courseId={courseId}
            onSetVisibility={onSetVisibility}
            getLinks={getLinks}
            busyId={busyId}
            setBusyId={setBusyId}
            onDeleteLink={onDeleteLink}
            deleteLoading={deleteLoading}
            router={router}
          />
        ))}

      {/*  CURRENT MONTH */}
      {current.map((month) => (
        <MonthBlock
          key={month}
          month={month}
          items={grouped[month]}
          openMonth={openMonth}
          setOpenMonth={setOpenMonth}
          isAdmin={isAdmin}
          courseId={courseId}
          onSetVisibility={onSetVisibility}
          getLinks={getLinks}
          busyId={busyId}
          setBusyId={setBusyId}
          onDeleteLink={onDeleteLink}
          deleteLoading={deleteLoading}
          router={router}
          highlight
        />
      ))}

      {/*  FUTURE MONTHS */}
      {futureMonths.map((month) => (
        <MonthBlock
          key={month}
          month={month}
          items={grouped[month]}
          openMonth={openMonth}
          setOpenMonth={setOpenMonth}
          isAdmin={isAdmin}
          courseId={courseId}
          onSetVisibility={onSetVisibility}
          getLinks={getLinks}
          busyId={busyId}
          setBusyId={setBusyId}
          onDeleteLink={onDeleteLink}
          deleteLoading={deleteLoading}
          router={router}
        />
      ))}
    </div>
  );
}

/* MONTH BLOCK */
function MonthBlock({
  month,
  items,
  openMonth,
  setOpenMonth,
  isAdmin,
  courseId,
  onSetVisibility,
  getLinks,
  busyId,
  setBusyId,
  onDeleteLink,
  deleteLoading,
  router,
  highlight,
}: any) {
  const isOpen = openMonth === month;

  return (
    <div
      className="bg-white"  
    >
      {/* HEADER */}
      <div
        onClick={() => setOpenMonth(isOpen ? "" : month)}
        className="flex justify-between items-center cursor-pointer px-4 py-3 bg-gray-100 hover:bg-gray-200"
      >
        <h2 className="font-semibold text-sm">
          📅 {month} {highlight && "(Current)"}
        </h2>

        <span>{isOpen ? "▼" : "▶"}</span>
      </div>

      {/* CONTENT */}
      {isOpen && (
        <ul className="space-y-2 p-3">
          {items.map((v: any) => {
            const isPublished = v.visibility === "PUBLISHED";
            const next = isPublished ? "HIDDEN" : "PUBLISHED";
            const isBusy = busyId === v.id;

            return (
              <li
                key={v.id}
                className="border p-3 flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{v.title}</div>
                  <div className="text-xs text-slate-500">
                    {v.visibility}
                  </div>
                </div>

                <div className="flex items-center gap-2">

                  {/* OPEN */}
                  <a
                    href={v.link}
                    target="_blank"
                    className="text-sm underline"
                  >
                    Open
                  </a>

                  {/* VISIBILITY */}
                  <button
                    onClick={async () => {
                      setBusyId(v.id);
                      await onSetVisibility(v.id, next);
                      setBusyId(null);
                    }}
                  >
                    {isPublished ? (
                      <FaRegEye size={18} />
                    ) : (
                      <FaRegEyeSlash size={18} />
                    )}
                  </button>

                  {/* ADMIN MENU */}
                  {isAdmin && (
                    <Modal>
                  <Menus>
                    <Menus.Toggle id={v.id} />
                    <Menus.List id={v.id}>
                      <Modal.Open opens="link-delete">
                        <Menus.ButtonMenu
                          variant="menu"
                          icon={<HiTrash size={18} className="text-zinc-400" />}
                        >
                          Delete
                        </Menus.ButtonMenu>
                      </Modal.Open>

                      <Menus.ButtonMenu
                        variant="menu"
                        icon={
                          <HiCog6Tooth size={18} className="text-zinc-400" />
                        }
                        onClick={() =>
                          router.push(
                            `/admin/courses/${courseId}/resources/${v.id}/access-control`,
                          )
                        }
                      >
                        Access Control
                      </Menus.ButtonMenu>
                    </Menus.List>

                    <Modal.Window name="link-delete">
                      <ConfirmDelete
                        resource="link"
                        disabled={deleteLoading}
                        onConfirm={async () => {
                          await onDeleteLink(v.id);
                          await getLinks();
                        }}
                      />
                    </Modal.Window>
                  </Menus>
                </Modal>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}