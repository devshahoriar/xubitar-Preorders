import FilterTabsBar from "@/components/page/home/FilterTabsBar";
import PreorderTable, { PreorderTableSkelton } from "@/components/page/home/PreorderTable";
import { loadSearchParams } from "@/components/page/home/searchParams";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { SearchParams } from "nuqs/server";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: PageProps) {
  const { page, status, sortBY, sortDir } =
    await loadSearchParams(searchParams);

  return (
    <main className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-6">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Preorders
          </h1>
          <Button size={"default"} asChild>
            <Link href={"/preorder"}>
              <Plus className="h-4 w-4" />
              Create Preorder
            </Link>
          </Button>
        </div>

        {/* Table Container Card */}
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          {/* Filter Tabs Bar */}
          <FilterTabsBar />
          <Suspense fallback={<PreorderTableSkelton />}>
            <PreorderTable
              page={page}
              status={status}
              sortBY={sortBY}
              sortDir={sortDir}
            />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
