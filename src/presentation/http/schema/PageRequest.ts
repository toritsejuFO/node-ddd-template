import { z } from 'zod'

const sort = z.object({
  field: z.string(),
  order: z.enum(['asc', 'desc'])
})

export const PageRequestSchema = z.object({
  limit: z.number().min(1).default(10),
  page: z.number().min(1).default(1),
  sort: sort.optional()
})
