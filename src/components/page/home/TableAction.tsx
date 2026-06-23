import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export default function TableAction() {
  return (
    <div className="flex items-center justify-end space-x-2">
      <Button
        variant="outline"
        size="icon"
        className="size-8 cursor-pointer border-neutral-200 text-neutral-600 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-white"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="size-8 cursor-pointer border-neutral-200 text-neutral-600 hover:text-red-600 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-red-400"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
