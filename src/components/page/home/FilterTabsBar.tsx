"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useQueryStates, parseAsInteger, parseAsStringEnum } from 'nuqs';

export default function FilterTabsBar() {
  const [params, setParams] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      status: parseAsStringEnum(["all", "active", "inactive"]).withDefault("all"),
      sortBY: parseAsStringEnum(["name", "createdAt", "startAt", "endAt"]).withDefault("createdAt"),
      sortDir: parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
    },
    {
      history: 'replace',
    }
  );

  return (
    <div className="flex flex-wrap items-center justify-between border-b border-neutral-200 p-4 dark:border-neutral-800">
      <div className="space-x-2">
        <Button
          variant={params.status === "all" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setParams({ status: "all", page: 1 })}
        >
          All
        </Button>
        <Button
          variant={params.status === "active" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setParams({ status: "active", page: 1 })}
        >
          Active
        </Button>
        <Button
          variant={params.status === "inactive" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setParams({ status: "inactive", page: 1 })}
        >
          Inactive
        </Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <ArrowUpDown className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="z-50 flex w-56 flex-col rounded-xl p-3 shadow-lg"
          align="end"
          sideOffset={8}
        >
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>

          {/* Sort Options */}
          <div className="mt-1 flex flex-col space-y-1">
            {[
              { id: "name", label: "Name" },
              { id: "createdAt", label: "Created At" },
              { id: "startAt", label: "Starts At" },
              { id: "endAt", label: "Ends At" },
            ].map((opt) => (
              <DropdownMenuItem
                key={opt.id}
                onClick={() => setParams({ sortBY: opt.id as any, page: 1 })}
                className="cursor-pointer"
              >
                <div
                  className={`h-4 w-4 rounded-full border transition-all ${
                    params.sortBY === opt.id
                      ? "border-[5px] border-neutral-900 bg-white dark:border-white dark:bg-neutral-900"
                      : "border-neutral-300 dark:border-neutral-600"
                  }`}
                />
                <span>{opt.label}</span>
              </DropdownMenuItem>
            ))}
          </div>

          <DropdownMenuSeparator />

          {/* Directions */}
          <div className="flex flex-col space-y-1">
            <DropdownMenuItem
              onClick={() => setParams({ sortDir: "asc", page: 1 })}
              className={`flex w-full cursor-pointer items-center space-x-2 rounded-lg px-3 py-2 text-sm font-bold transition-all ${
                params.sortDir === "asc"
                  ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                  : "text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
              }`}
            >
              <ArrowUp className="h-4 w-4" />
              <span>Ascending</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setParams({ sortDir: "desc", page: 1 })}
              className={`flex w-full cursor-pointer items-center space-x-2 rounded-lg px-3 py-2 text-sm font-bold transition-all ${
                params.sortDir === "desc"
                  ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                  : "text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
              }`}
            >
              <ArrowDown className="h-4 w-4" />
              <span>Descending</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
