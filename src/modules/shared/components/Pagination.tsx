"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/modules/ui/button";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

const PAGE_SIZE = Number(process.env.NEXT_PUBLIC_PAGE_SIZE!);

function Pagination({
  count,
  refetch,
  courseTypeId,
}: {
  count: number;
  courseTypeId?: number | undefined;
  refetch?: (
    pageReset?: number,
    courseTypeId?: number | undefined,
  ) => Promise<void>;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const courseType = searchParams.get("courseType") || undefined;
  const currentPage = Number(searchParams.get("page") || 1);
  const pageCount = Math.ceil(count / PAGE_SIZE);

  function handleUpdatePage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  }

  function handleNext() {
    if (currentPage < pageCount) {
      handleUpdatePage(currentPage + 1);
      if (courseType) return refetch?.(currentPage, courseTypeId);
      refetch?.(currentPage);
    }
  }

  function handlePrev() {
    if (currentPage > 1) {
      handleUpdatePage(currentPage - 1);
      //  refetch?.(currentPage, courseType);
      if (courseType) return refetch?.(currentPage, courseTypeId);
      refetch?.(currentPage);
    }
  }

  if (pageCount <= 1) return null;

  return (
    <div className="flex items-center mx-5 my-8">
      <p className="ml-1 w-fit text-xs text-slate-500 md:text-sm font-medium">
        <em>
          Showing{" "}
          <span className="font-medium">
            {(currentPage - 1) * PAGE_SIZE + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {currentPage === pageCount ? count : currentPage * PAGE_SIZE}
          </span>{" "}
          of <span className="font-medium">{count}</span> results
        </em>
      </p>
      <div className="ml-auto flex w-fit gap-3">
        <Button
          variant="secondary"
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          <HiChevronLeft /> <span>Previous</span>
        </Button>
        <Button
          variant="secondary"
          onClick={handleNext}
          disabled={currentPage === pageCount}
        >
          <span>Next</span>
          <HiChevronRight />
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
