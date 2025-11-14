import { z } from "zod";
import { EDirectionFilter } from "../enums/order-by.enum";
import {
  validOptionalEmail,
  validOptionalString,
  validPhoneNumber,
  validPositiveNumber,
  validUUID,
} from "../utils/common-validation";
import { baseSearchQuerySchema } from "./base-search-query.dto";

export const RedeemSchema = z.object({
  name: z.string(),
  registrationId: validOptionalString(),
  phoneNumber: validPhoneNumber(),
  email: validOptionalEmail(),
  address: z.string(),
  unit: validPositiveNumber(),
  shippingAddressId: validOptionalString(),
  rewardId: validUUID(),
  appMasterId: validPositiveNumber(),
});

export const GetRedeemSchema = baseSearchQuerySchema
  .extend({
    orderBy: z
      .string()
      .optional()
      .transform((val) => (val?.trim() ? val.trim().toLowerCase() : undefined))
      .pipe(z.enum(["employee_code"]).optional().default("employee_code")),

    direction: z
      .string()
      .optional()
      .transform((val) => (val?.trim() ? val.trim().toLowerCase() : undefined))
      .pipe(z.enum(EDirectionFilter).optional().default(EDirectionFilter.Asc)),

    startDate: z
      .string()
      .optional()
      .transform((val) => (val ? new Date(val) : undefined)),
    endDate: z
      .string()
      .optional()
      .transform((val) => (val ? new Date(val) : undefined)),

    appMasterId: validPositiveNumber(),
  })
  .refine(
    ({ startDate, endDate }) =>
      !(startDate && endDate && startDate.getTime() > endDate.getTime()),
    {
      message: "startDate must less than or equal to endDate",
      path: ["startDate", "endDate"],
    }
  );

export type TRedeemSchema = z.infer<typeof RedeemSchema>;
export type TGetRedeem = z.infer<typeof GetRedeemSchema>;
