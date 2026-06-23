import FilterTabsBar from "@/components/page/home/FilterTabsBar";
import { loadSearchParams } from '@/components/page/home/searchParams';
import TableAction from "@/components/page/home/TableAction";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/server";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import type { SearchParams } from 'nuqs/server';

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default async function Page({ searchParams }: PageProps) {
  const { page, status, sortBY, sortDir } = await loadSearchParams(searchParams);
  const { preorders, totalCount, totalPage } = await api.preorder.getAll({
    page,
    status: status as any,
    sortBY: sortBY as any,
    sortDir: sortDir as any,
  });

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

          {/* Responsive Table */}
          <Table>
            <TableHeader>
              <TableRow className="border-b border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:bg-neutral-900/50 [&>th]:px-4 [&>th]:py-2 [&>th]:text-xs [&>th]:font-semibold [&>th]:tracking-wider [&>th]:text-neutral-500 [&>th]:uppercase [&>th]:dark:text-neutral-400">
                <TableHead className="w-12 text-center align-middle">
                  <div className="flex items-center justify-center">
                    <Checkbox className="cursor-pointer" />
                  </div>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Preorder when</TableHead>
                <TableHead>Starts at</TableHead>
                <TableHead>Ends at</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {preorders.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="px-6 py-4 text-center align-middle">
                    <div className="flex items-center justify-center">
                      <Checkbox className="cursor-pointer" />
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      {item.name}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm text-neutral-600 dark:text-neutral-300">
                    {item.products}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm text-neutral-600 dark:text-neutral-300">
                    {item.type}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm text-neutral-600 dark:text-neutral-300">
                    {item.startsAt.toDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm text-neutral-600 dark:text-neutral-300">
                    {item.endsAt?.toDateString() || "—"}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center justify-center">
                      {/* Custom Status Toggle mimicking screenshot */}
                      <div
                        className={`flex h-6 w-11 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 ${
                          item.isActive
                            ? "bg-neutral-900 dark:bg-white"
                            : "bg-neutral-200 dark:bg-neutral-700"
                        }`}
                      >
                        <div
                          className={`h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 dark:bg-neutral-950 ${
                            item.isActive ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <TableAction />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center gap-4 border-t border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
            <Button
              variant="outline"
              size="icon"
              className={`size-8 border-neutral-200 text-neutral-400 dark:border-neutral-800 dark:text-neutral-500 ${
                page <= 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
              disabled={page <= 1}
              asChild={page > 1}
            >
              {page > 1 ? (
                <Link
                  href={`/?${new URLSearchParams({
                    page: String(page - 1),
                    ...(status && status !== "all" ? { status } : {}),
                    ...(sortBY && sortBY !== "createdAt" ? { sortBY } : {}),
                    ...(sortDir && sortDir !== "desc" ? { sortDir } : {}),
                  }).toString()}`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              Showing {totalCount === 0 ? 0 : (page - 1) * 10 + 1} to {Math.min(page * 10, totalCount)} of {totalCount}
            </span>
            <Button
              variant="outline"
              size="icon"
              className={`size-8 border-neutral-200 text-neutral-400 dark:border-neutral-800 dark:text-neutral-500 ${
                page >= totalPage ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
              disabled={page >= totalPage}
              asChild={page < totalPage}
            >
              {page < totalPage ? (
                <Link
                  href={`/?${new URLSearchParams({
                    page: String(page + 1),
                    ...(status && status !== "all" ? { status } : {}),
                    ...(sortBY && sortBY !== "createdAt" ? { sortBY } : {}),
                    ...(sortDir && sortDir !== "desc" ? { sortDir } : {}),
                  }).toString()}`}
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
