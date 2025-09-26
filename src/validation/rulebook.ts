// validation/rulebook.ts
import { z } from "zod";
import {
  validOptionalPositiveNumber,
  validOptionalPositiveNumberWithRange,
  validOptionalString,
} from "../utils/common-validation";
import { fieldError } from "../utils/zod-error-map";

export const GameRuleSchema = z.object(
  {
    gameId: z.number({ error: "Game ID is required" }),
    gameMasterDataId: validOptionalString(),
    customerMasterDataId: validOptionalPositiveNumber(),
    version: validOptionalString(),
    trafficPercentage: validOptionalPositiveNumberWithRange(0, 100),
    page: validOptionalString(),
    durationDays: z.number({ error: "Duration is required" }).min(1),
    point: z.number({ error: "Point is required" }).min(1),
    rewardId: validOptionalString(),
    dropOffDays: validOptionalPositiveNumber(),
    pushMessage: validOptionalString(),
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
