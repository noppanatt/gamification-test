import { z } from "zod";
import { EDirectionFilter } from "../enums/order-by.enum";
import { ERuleOrderBy } from "../enums/rule.enum";
import {
  validOptionalPositiveNumber,
  validOptionalPositiveNumberWithRange,
  validOptionalString,
  validPositiveNumber,
} from "../utils/common-validation";
import { fieldError } from "../utils/zod-error-map";

export const GameRuleSchema = z.object(
  {
    gameId: z.number({ error: "Game ID is required" }),
    gameMasterDataId: validOptionalString(),
    customerMasterDataId: validPositiveNumber(),
    version: validOptionalString(),
    trafficPercentage: validOptionalPositiveNumberWithRange(0, 100),
    page: validOptionalString(),
    durationDays: z.number({ error: "Duration is required" }).min(1),
    point: z.number({ error: "Point is required" }).min(1),
    multiply: validOptionalPositiveNumber(),
    rewardId: validOptionalString(),
    dropOffDays: validOptionalPositiveNumber(),
    pushMessage: validOptionalString(),
    pushAmount: validOptionalPositiveNumber(),
    timeToPush: validOptionalString(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    active: z.boolean(),
  },
  { error: fieldError }
);

export const CreateGameRuleBodySchema = z.object({
  fileName: z.string(),
  data: z.array(GameRuleSchema),
});

export const getGameRuleSchema = z.object({
  orderBy: z
    .string()
    .optional()
    .transform((val) => (val?.trim() ? val.trim().toLowerCase() : undefined))
    .pipe(z.enum(ERuleOrderBy).optional().default(ERuleOrderBy.UpdatedAt)),
  direction: z
    .string()
    .optional()
    .transform((val) => (val?.trim() ? val.trim().toLowerCase() : undefined))
    .pipe(z.enum(EDirectionFilter).optional().default(EDirectionFilter.Desc)),
  appId: z.coerce.number().positive(),
});

export const editGameRuleSchema = z.object({
  appId: z.coerce.number().positive(),
  ruleId: z.uuidv4(),
});

export type GameRuleDTO = z.infer<typeof GameRuleSchema>;
export type CreateGameRuleBody = z.infer<typeof CreateGameRuleBodySchema>;
export type TGetGameRule = z.infer<typeof getGameRuleSchema>;
export type TEditGameRule = z.infer<typeof editGameRuleSchema>;
