import { z } from "zod";

export const statusSchema = z.object({
  _id: z.string(),
  label: z.string(),
  order: z.number(),
  isActive: z.boolean(),
});
