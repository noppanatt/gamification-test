import { z } from "zod";
import { EUpdateCoinMethod } from "../enums/update-coin.enum";

export const updateRewardSchema = z.object({
  method: z.enum(EUpdateCoinMethod),
  amount: z.coerce.number().positive(),
  appMasterId: z.coerce.number().positive(),
});

export const getUserCoinSchema = z.object({
  referenceId: z.uuid(),
  appMasterId: z.coerce.number().positive(),
});

export type TUpdateRewardSchema = z.infer<typeof updateRewardSchema>;

export type TGetUserCoinSchema = z.infer<typeof getUserCoinSchema>;
