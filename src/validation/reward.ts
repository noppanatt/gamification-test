// validation/rulebook.ts
import { z } from "zod";

export const CreateRewardSchema = z.object({
  name: z.string(),
  point: z.number(),
  description: z.string(),
  termsAndCondition: z.string(),
});

export const editRewardSchema = z.object({
  rewardId: z.uuidv4(),
});
