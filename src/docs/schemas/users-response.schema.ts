import { z } from "zod";

export const userSchema = z.object({
  _id: z.string(),
  name: z.string(),
  username: z.string(),
  email: z.string(),
  isActive: z.boolean(),
});
