import { z } from "zod";

export const disciplineSchema = z.object({
  _id: z.string(),
  label: z.string(),
  order: z.number(),
  isActive: z.boolean(),
});
