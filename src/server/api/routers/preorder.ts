import preorderFormSchema from "@/components/page/preorder/formSchema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import z from "zod";

const preOrderRouter = createTRPCRouter({
  getAll: publicProcedure.input(z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
    status: z.enum(["all", "active", "inactive"]).default('all'),
    sortBY: z.enum(["name", "createdAt", "startAt", "endAt"]).default('createdAt'),
    sortDir: z.enum(["asc", "desc"]).default('desc'),
  })).query(async ({ ctx, input }) => {
    const where: any = {};
    if (input.status === "active") {
      where.isActive = true;
    } else if (input.status === "inactive") {
      where.isActive = false;
    }

    const orderByField: "name" | "createdAt" | "startsAt" | "endsAt" =
      input.sortBY === "startAt"
        ? "startsAt"
        : input.sortBY === "endAt"
          ? "endsAt"
          : input.sortBY;

    const orderBy = {
      [orderByField]: input.sortDir,
    };

    const take = input.limit;
    const skip = (input.page - 1) * take;

    const [preorders, totalCount] = await Promise.all([
      ctx.db.preorder.findMany({
        where,
        orderBy,
        take,
        skip,
      }),
      ctx.db.preorder.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / take);

    return {
      preorders,
      currentPage: input.page,
      isHaveNextPage: input.page < totalPages,
      totalPage: totalPages,
      totalCount,
      limit: take
    };
  }),
  create: publicProcedure
    .input(preorderFormSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.preorder.create({
        data: {
          name: input.name,
          products: input.products,
          type: input.preorderWhen === "regardless-of-stock" ? "REGARDLESS_OF_STOCK" : "OUT_OF_STOCK",
          startsAt: new Date(input.startsAt),
          endsAt: input.endsAt ? new Date(input.endsAt) : null,
          isActive: input.isActive,
        },
      });
    }),
  edit: publicProcedure
    .input(
      preorderFormSchema.extend({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.preorder.update({
        where: { id: input.id },
        data: {
          name: input.name,
        },
      });
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.preorder.delete({
        where: { id: input.id },
      });
    }),
});

export default preOrderRouter;
