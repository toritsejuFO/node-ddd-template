import { z } from 'zod'

import { PageRequestSchema } from '@presentation/http/schema/PageRequest'

export type PageRequest = z.infer<typeof PageRequestSchema>
