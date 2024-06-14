import { z } from 'zod'

import { LoginSchema } from '../../presentation/http/schema/AuthSchema'

export type LoginDto = z.infer<typeof LoginSchema>
