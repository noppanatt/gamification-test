import { z } from "zod";
import { EUpdatePointMethod } from "../enums/update-point.enum";
import { validPositiveNumberWithZero } from "../utils/common-validation";

export const updateRewardSchema = z.object({
  method: z.enum(EUpdatePointMethod),
  amount: validPositiveNumberWithZero(),
  appMasterId: z.coerce.number().positive(),
});

export const getUserPointSchema = z.object({
  referenceId: z.uuid(),
  appMasterId: z.coerce.number().positive(),
});

export const getAllUserPointSchema = z.object({
  appMasterId: z.coerce.number().positive(),
});

export type TGetAllUserPointSchema = z.infer<typeof getAllUserPointSchema>;

export type TUpdateRewardSchema = z.infer<typeof updateRewardSchema>;

export type TGetUserPointSchema = z.infer<typeof getUserPointSchema>;
