import { z } from "zod";

export const validationExportByIdsSchema = z.object({
  ids: z
    .array(z.string().uuid())
    .min(1, "At least 1 ID required")
    .max(1000, "Maximum 1000 IDs allowed"),
});

export type TExportByIds = z.infer<typeof validationExportByIdsSchema>;
