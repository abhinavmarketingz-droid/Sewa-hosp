import { z } from "zod"

export const pageBlockSchema = z.object({
  id: z.string().trim().min(1),
  type: z.string().trim().min(1),
  data: z.record(z.unknown()).default({}),
})

export const pageSchema = z.object({
  id: z.string().trim().min(1).optional(),
  slug: z.string().trim().min(2).max(120),
  title: z.string().trim().min(2).max(200),
  status: z.enum(["draft", "published"]).default("draft"),
  blocks: z.array(pageBlockSchema).default([]),
})

export type PagePayload = z.infer<typeof pageSchema>
