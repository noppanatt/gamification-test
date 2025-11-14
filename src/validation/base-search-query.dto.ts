import z from "zod";
import { EDirectionFilter } from "../enums/order-by.enum";

export const baseSearchQuerySchema = z.object({
  searchText: z.string().trim().optional(),
  orderBy: z
    .string()
    .optional()
    .transform((val) => (val?.trim() ? val.trim().toLowerCase() : undefined))
    .pipe(
      z
        .enum(["order_no", "customer_no", "customer_grade", "order_date"])
        .optional()
        .default("order_no")
    ),
  direction: z
    .string()
    .optional()
    .transform((val) => (val?.trim() ? val.trim().toLowerCase() : undefined))
    .pipe(z.enum(EDirectionFilter).optional().default(EDirectionFilter.Desc)),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined))
    .pipe(z.number().min(1).optional().default(1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined))
    .pipe(z.number().min(1).optional().default(10)),
});
