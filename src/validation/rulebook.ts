// validation/rulebook.ts
import { z } from "zod";

export const GameRuleSchema = z.object({
  gameId: z.number(),
  gameMasterDataId: z.string(),
  customerMasterDataId: z.number().nullable(),
  version: z.string().nullable(),
  trafficPercentage: z.number().nullable(),
  page: z.string(),
  durationDays: z.number().nullable(),
  point: z.number().nullable(),
  rewardId: z.string(), // CSV
  dropOffDays: z.number().nullable(),
  pushMessage: z.string().nullable(),
  timeToPush: z.string().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  active: z.boolean().nullable(),
});

export const CreateGameRuleBodySchema = z.object({
  fileName: z.string(),
  data: z.array(GameRuleSchema),
});

export type GameRuleDTO = z.infer<typeof GameRuleSchema>;
export type CreateGameRuleBody = z.infer<typeof CreateGameRuleBodySchema>;
