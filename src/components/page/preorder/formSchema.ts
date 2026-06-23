import z from 'zod';

const preorderFormSchema = z.object({
  name: z.string().min(1, "Name is required."),
  products: z
    .number({ message: "Products must be a number." })
    .min(1, "Products count must be at least 1."),
  preorderWhen: z.enum(["regardless-of-stock", "out-of-stock"]),
  startsAt: z.string().min(1, "Start date and time is required."),
  endsAt: z.string(),
  isActive: z.boolean(),
});

export default preorderFormSchema