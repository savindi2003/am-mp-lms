import { z } from "zod";

export const packageSchema = z.object({
  name: z.string().min(3),
  totalFee: z.coerce.number().min(0),

  classIds: z.array(z.string()).min(1),
});