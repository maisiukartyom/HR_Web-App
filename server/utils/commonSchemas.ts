import { z } from "zod";

export const deletionRequest = z.object({
    id: z.number()
  })

export const mutationResponse = z.object({
    success: z.boolean()
})