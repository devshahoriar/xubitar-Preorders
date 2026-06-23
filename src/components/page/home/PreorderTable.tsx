import PaginationControls from "@/components/page/home/PaginationControls";
import TableAction from "@/components/page/home/TableAction";
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

export default async function PreorderTable({
  page,
  status,
  sortBY,
  sortDir,
}: {
  page: number;
  status: "all" | "active" | "inactive" | null;
  sortBY: "name" | "createdAt" | "startAt" | "endAt" | null;
  sortDir: "asc" | "desc" | null;
}) {
  const { preorders, totalCount, limit } = await api.preorder.getAll({
    page,
    status: status ?? undefined,
    sortBY: sortBY ?? undefined,
    sortDir: sortDir ?? undefined,
  });
  return (
    <>
      {/* Preorder Table */}
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
      <PaginationControls totalCount={totalCount} limit={limit} />
    </>
  );
}
