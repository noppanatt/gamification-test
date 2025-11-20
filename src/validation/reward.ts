import { z } from "zod";

export const CreateRewardSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is Required" }),
  point: z.number(),
  description: z
    .string()
    .trim()
    .min(1, { message: "Description is Required" })
    .max(300, { message: "Description has max length: 300" }),
  termsAndCondition: z
    .string()
    .trim()
    .min(1, { message: "Terms And Condition is Required" })
    .max(1500, { message: "Terms And Condition has max length: 1500" }),
  fileOriginalName: z
    .string()
    .trim()
    .min(1, { message: "Description is Required" }),
  fileId: z.uuidv4(),
  isDraft: z.boolean(),
});

export const editRewardSchema = z.object({
  rewardId: z.uuidv4(),
});
