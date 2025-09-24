// validation/rulebook.ts
import { z } from "zod";

export const CreateRewardSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is Required" }),
  point: z.number(),
  description: z.string().trim().min(1, { message: "Description is Required" }),
  termsAndCondition: z
    .string()
    .trim()
    .min(1, { message: "Terms And Condition is Required" }),
  fileOriginalName: z
    .string()
    .trim()
    .min(1, { message: "Description is Required" }),
  fileId: z.uuidv4(),
});

export const editRewardSchema = z.object({
  rewardId: z.uuidv4(),
});
