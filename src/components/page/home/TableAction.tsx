"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { api, type RouterOutputs } from "@/trpc/react";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { usePerOrderSelect } from "./usePreOrderSelect";
import { Checkbox } from "@/components/ui/checkbox";

export function TableAction({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const deletePreorder = api.preorder.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.success("Preorder deleted successfully!");
    },
    onError: (err) => {
      toast.error("Failed to delete preorder", {
        description: err.message,
      });
    },
  });

  return (
    <div className="flex items-center justify-end space-x-2">
      <Button
        variant="outline"
        size="icon"
        className="size-8 cursor-pointer border-neutral-200 text-neutral-600 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-white"
        asChild
      >
        <Link href={`/preorder?id=${id}`}>
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="size-8 cursor-pointer border-neutral-200 text-neutral-600 hover:text-red-600 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-red-400"
            disabled={deletePreorder.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Preorder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the preorder{" "}
              <strong>{name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => deletePreorder.mutate({ id })}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function StatusUpdateSwitch({
  isActive,
  id,
}: {
  isActive: boolean;
  id: string;
}) {
  const router = useRouter();
  const editPreorder = api.preorder.edit.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.success("Preorder updated successfully!");
    },
    onError: (err) => {
      toast.error("Failed to update preorder", {
        description: err.message,
      });
    },
  });

  return (
    <Switch
      disabled={editPreorder?.isPending}
      checked={isActive}
      onCheckedChange={(checked) =>
        editPreorder.mutate({ id, isActive: checked })
      }
    />
  );
}

export function SelectAllCheckBox ({
  preOrders,
}: {
  preOrders: RouterOutputs["preorder"]["getAll"]["preorders"];
})  {
  const { select, selectedIds } = usePerOrderSelect();

  return (
    <div className="flex items-center justify-center">
      <Checkbox
        checked={
          Array.isArray(preOrders) &&
          preOrders.length > 0 &&
          preOrders.every((preorder) => selectedIds.has(preorder.id))
        }
        onCheckedChange={(checked) => {
          if (checked) {
            const ids = preOrders.map((preorder) => preorder.id);
            select(ids);
          } else {
            const ids = preOrders.map((preorder) => preorder.id);
            select(ids);
          }
        }}
      />
    </div>
  );
};

export function SelectSingleCheckBox({
  id,
}: {
  id: string;
}) {
  const { select, selectedIds } = usePerOrderSelect();

  return (
    <div className="flex items-center justify-center">
      <Checkbox
        checked={selectedIds.has(id)}
        onCheckedChange={(checked) => {
          if (checked) {
            select(id);
          } else {
            select(id);
          }
        }}
      />
    </div>
  );
}