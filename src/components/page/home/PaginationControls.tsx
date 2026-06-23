"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useHomeParams from "./useHomeParams";
import { usePerOrderSelect } from "./usePreOrderSelect";

interface PaginationControlsProps {
  totalCount: number;
  limit: number;
}

export default function PaginationControls({
  totalCount,
  limit,
}: PaginationControlsProps) {
  const [params, setParams] = useHomeParams();

  const page = params.page;
  const totalPage = Math.ceil(totalCount / limit);

  const handlePageChange = (newPage: number) => {
    setParams({ page: newPage });
  };

  return (
    <div className="relative flex items-center justify-center gap-4 border-t border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
      <ShowSelectNumber />
      <Button
        variant="outline"
        size="icon"
        className={`size-8 border-neutral-200 text-neutral-400 dark:border-neutral-800 dark:text-neutral-500 ${
          page <= 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
        disabled={page <= 1}
        onClick={() => handlePageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
        Showing {totalCount === 0 ? 0 : (page - 1) * limit + 1} to{" "}
        {Math.min(page * limit, totalCount)} of {totalCount}
      </span>

      <Button
        variant="outline"
        size="icon"
        className={`size-8 border-neutral-200 text-neutral-400 dark:border-neutral-800 dark:text-neutral-500 ${
          page >= totalPage ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
        disabled={page >= totalPage}
        onClick={() => handlePageChange(page + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

const ShowSelectNumber = () => {
  const { selectedIds } = usePerOrderSelect();
  if (selectedIds.size <= 0) {
    return null;
  }

  return (
    <span className="absolute left-4 text-xs font-semibold text-neutral-500 md:left-6 dark:text-neutral-400">
      {selectedIds.size} selected
    </span>
  );
};
