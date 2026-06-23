"use client";

import preorderFormSchema from "@/components/page/preorder/formSchema";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { useForm, useStore } from "@tanstack/react-form";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";

const preOrdersDF = {
  name: "",
  products: 1,
  preorderWhen: "regardless-of-stock" as "regardless-of-stock" | "out-of-stock",
  startsAt: new Date().toISOString().slice(0, 16),
  endsAt: "",
  isActive: true,
};

function PreorderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const util = api.useUtils();
  const { data: preorderData, isLoading } = api.preorder.getById.useQuery(
    {
      id: editId ?? "",
    },
    {
      enabled: !!editId,
    },
  );

  const createPreorder = api.preorder.create.useMutation({
    onSuccess: () => {
      toast.success("Preorder saved successfully!");

      router.push("/");
      router.refresh();
    },
    onError: (err) => {
      toast.error("Failed to save preorder", {
        description: err.message,
      });
    },
  });

  const editPreorder = api.preorder.edit.useMutation({
    onSuccess: () => {
      toast.success("Preorder updated successfully!");
      util.preorder.getById.invalidate();
      router.push("/");
      router.refresh();
    },
    onError: (err) => {
      toast.error("Failed to update preorder", {
        description: err.message,
      });
    },
  });

  const loading =
    isLoading || createPreorder.isPending || editPreorder.isPending;

  const form = useForm({
    defaultValues: preOrdersDF,
    validators: {
      onChange: preorderFormSchema,
    },

    onSubmit: async ({ value }) => {
      if (editId) {
        await editPreorder.mutateAsync({ id: editId, ...value });
      } else {
        await createPreorder.mutateAsync(value);
      }
    },
  });

  const isDirty = useStore(form.store, (state) => state.isDirty);

  useEffect(() => {
    if (preorderData) {
      form.reset({
        name: preorderData.name,
        products: preorderData.products,
        preorderWhen:
          preorderData.type === "REGARDLESS_OF_STOCK"
            ? "regardless-of-stock"
            : "out-of-stock",
        startsAt: preorderData.startsAt
          ? new Date(preorderData.startsAt).toISOString().slice(0, 16)
          : "",
        endsAt: preorderData.endsAt
          ? new Date(preorderData.endsAt).toISOString().slice(0, 16)
          : "",
        isActive: preorderData.isActive,
      });
    }
  }, [preorderData]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}
      {/* Top Action Bar */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="cursor-pointer space-y-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="preorder-form"
            className="cursor-pointer font-semibold"
            disabled={loading || !isDirty}
          >
            {createPreorder.isPending || editPreorder.isPending
              ? "Saving..."
              : "Save changes"}
          </Button>
        </div>
      </div>

      {/* Main Details Card */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        {/* Card Header */}
        <div className="border-b border-neutral-200 p-6 dark:border-neutral-800">
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            Preorder details
          </h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            These values appear in the preorders list.
          </p>
        </div>

        {/* Form Body */}
        <form
          id="preorder-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="divide-y divide-neutral-200 dark:divide-neutral-800"
        >
          {/* Row: Name */}
          <form.Field name="name">
            {(field) => {
              const isInvalid = !!(
                field.state.meta.isTouched && field.state.meta.errors.length
              );
              const errors = field.state.meta.errors.map((err) =>
                typeof err === "string" ? { message: err } : err,
              );
              return (
                <Field
                  orientation="horizontal"
                  data-invalid={isInvalid}
                  className="grid grid-cols-1 items-start gap-4 p-6 md:grid-cols-3"
                >
                  <div className="md:col-span-1">
                    <FieldLabel
                      htmlFor={field.name}
                      className="flex items-center text-sm font-bold text-neutral-900 dark:text-neutral-100"
                    >
                      Name<span className="ml-0.5 text-red-500">*</span>
                    </FieldLabel>
                    <FieldDescription className="mt-1 max-w-[200px] text-xs text-neutral-500 dark:text-neutral-400">
                      A label to recognize this preorder by.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={errors} className="mt-1" />
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-9 max-w-md border-neutral-200 bg-transparent dark:border-neutral-700"
                      aria-invalid={isInvalid}
                      disabled={isLoading}
                      placeholder="Name"
                    />
                  </div>
                </Field>
              );
            }}
          </form.Field>

          {/* Row: Products */}
          <form.Field name="products">
            {(field) => {
              const isInvalid = !!(
                field.state.meta.isTouched && field.state.meta.errors.length
              );
              const errors = field.state.meta.errors.map((err) =>
                typeof err === "string" ? { message: err } : err,
              );
              return (
                <Field
                  orientation="horizontal"
                  data-invalid={isInvalid}
                  className="grid grid-cols-1 items-start gap-4 p-6 md:grid-cols-3"
                >
                  <div className="md:col-span-1">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-sm font-bold text-neutral-900 dark:text-neutral-100"
                    >
                      Products
                    </FieldLabel>
                    <FieldDescription className="mt-1 max-w-[200px] text-xs text-neutral-500 dark:text-neutral-400">
                      Number of products covered by this preorder.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={errors} className="mt-1" />
                    )}
                  </div>
                  <div className="flex items-center space-x-3 md:col-span-2">
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        const parsed = parseInt(e.target.value, 10);
                        field.handleChange(isNaN(parsed) ? 0 : parsed);
                      }}
                      className="h-9 w-24 border-neutral-200 bg-transparent text-center dark:border-neutral-700"
                      aria-invalid={isInvalid}
                      disabled={isLoading}
                    />
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      product(s)
                    </span>
                  </div>
                </Field>
              );
            }}
          </form.Field>

          {/* Row: Preorder When */}
          <form.Field name="preorderWhen">
            {(field) => {
              const isInvalid = !!(
                field.state.meta.isTouched && field.state.meta.errors.length
              );
              const errors = field.state.meta.errors.map((err) =>
                typeof err === "string" ? { message: err } : err,
              );
              return (
                <Field
                  orientation="horizontal"
                  data-invalid={isInvalid}
                  className="grid grid-cols-1 items-start gap-4 p-6 md:grid-cols-3"
                >
                  <div className="md:col-span-1">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-sm font-bold text-neutral-900 dark:text-neutral-100"
                    >
                      Preorder when
                    </FieldLabel>
                    <FieldDescription className="mt-1 max-w-[200px] text-xs text-neutral-500 dark:text-neutral-400">
                      When customers are allowed to preorder.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={errors} className="mt-1" />
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <Select
                      value={field.state.value}
                      onValueChange={(val) => field.handleChange(val as any)}
                      disabled={isLoading}
                    >
                      <SelectTrigger
                        id={field.name}
                        className="h-9 w-full max-w-md justify-between border-neutral-200 bg-transparent dark:border-neutral-700"
                        aria-invalid={isInvalid}
                      >
                        <SelectValue placeholder="Select preorder type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="regardless-of-stock"
                          className="cursor-pointer"
                        >
                          regardless-of-stock
                        </SelectItem>
                        <SelectItem
                          value="out-of-stock"
                          className="cursor-pointer"
                        >
                          out-of-stock
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Field>
              );
            }}
          </form.Field>

          {/* Row: Starts At */}
          <form.Field name="startsAt">
            {(field) => {
              const isInvalid = !!(
                field.state.meta.isTouched && field.state.meta.errors.length
              );
              const errors = field.state.meta.errors.map((err) =>
                typeof err === "string" ? { message: err } : err,
              );
              return (
                <Field
                  orientation="horizontal"
                  data-invalid={isInvalid}
                  className="grid grid-cols-1 items-start gap-4 p-6 md:grid-cols-3"
                >
                  <div className="md:col-span-1">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-sm font-bold text-neutral-900 dark:text-neutral-100"
                    >
                      Starts at
                    </FieldLabel>
                    <FieldDescription className="mt-1 max-w-[200px] text-xs text-neutral-500 dark:text-neutral-400">
                      When the preorder window opens.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={errors} className="mt-1" />
                    )}
                  </div>
                  <div className="relative max-w-md md:col-span-2">
                    <Input
                      type="datetime-local"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-9 border-neutral-200 bg-transparent dark:border-neutral-700"
                      aria-invalid={isInvalid}
                      disabled={isLoading}
                    />
                  </div>
                </Field>
              );
            }}
          </form.Field>

          {/* Row: Ends At */}
          <form.Field name="endsAt">
            {(field) => {
              const isInvalid = !!(
                field.state.meta.isTouched && field.state.meta.errors.length
              );
              const errors = field.state.meta.errors.map((err) =>
                typeof err === "string" ? { message: err } : err,
              );
              return (
                <Field
                  orientation="horizontal"
                  data-invalid={isInvalid}
                  className="grid grid-cols-1 items-start gap-4 p-6 md:grid-cols-3"
                >
                  <div className="md:col-span-1">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-sm font-bold text-neutral-900 dark:text-neutral-100"
                    >
                      Ends at
                    </FieldLabel>
                    <FieldDescription className="mt-1 max-w-[200px] text-xs text-neutral-500 dark:text-neutral-400">
                      Leave empty for no end date.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={errors} className="mt-1" />
                    )}
                  </div>
                  <div className="relative max-w-md md:col-span-2">
                    <Input
                      type="datetime-local"
                      id={field.name}
                      name={field.name}
                      placeholder="mm / dd / yyyy , --:-- --"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-9 border-neutral-200 bg-transparent placeholder:text-neutral-400 dark:border-neutral-700 dark:placeholder:text-neutral-600"
                      aria-invalid={isInvalid}
                      disabled={isLoading}
                    />
                  </div>
                </Field>
              );
            }}
          </form.Field>

          {/* Row: Status */}
          <form.Field name="isActive">
            {(field) => {
              const isInvalid = !!(
                field.state.meta.isTouched && field.state.meta.errors.length
              );
              const errors = field.state.meta.errors.map((err) =>
                typeof err === "string" ? { message: err } : err,
              );
              return (
                <Field
                  orientation="horizontal"
                  data-invalid={isInvalid}
                  className="grid grid-cols-1 items-start gap-4 p-6 md:grid-cols-3"
                >
                  <div className="md:col-span-1">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-sm font-bold text-neutral-900 dark:text-neutral-100"
                    >
                      Status
                    </FieldLabel>
                    <FieldDescription className="mt-1 max-w-[200px] text-xs text-neutral-500 dark:text-neutral-400">
                      Active preorders are visible to customers.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={errors} className="mt-1" />
                    )}
                  </div>
                  <div className="flex items-center space-x-3 md:col-span-2">
                    <button
                      id={field.name}
                      type="button"
                      disabled={isLoading}
                      onClick={() =>
                        !isLoading && field.handleChange(!field.state.value)
                      }
                      className={`flex h-6 w-11 items-center rounded-full p-1 transition-colors duration-200 ${
                        field.state.value
                          ? "bg-neutral-900 dark:bg-white"
                          : "bg-neutral-200 dark:bg-neutral-700"
                      } ${isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                      aria-label="Toggle active status"
                    >
                      <div
                        className={`h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 dark:bg-neutral-950 ${
                          field.state.value ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span className="text-sm font-medium text-neutral-700 select-none dark:text-neutral-300">
                      Active
                    </span>
                  </div>
                </Field>
              );
            }}
          </form.Field>
        </form>

        {/* Card Footer */}
        <div className="flex items-center justify-end space-x-3 border-t border-neutral-200 bg-neutral-50/50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900/50">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="preorder-form"
            className="cursor-pointer font-semibold"
            disabled={loading || !isDirty}
          >
            {createPreorder.isPending || editPreorder.isPending
              ? "Saving..."
              : "Save changes"}
          </Button>
        </div>
      </div>
    </main>
  );
}

// if use useSearchParams than need it
export default function PreOrderSuspense() {
  return (
    <Suspense fallback={null}>
      <PreorderPage />
    </Suspense>
  );
}
