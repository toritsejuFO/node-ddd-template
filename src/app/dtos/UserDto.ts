import { z } from 'zod'

import {
  LoginSchema,
  UserSchema,
  ActivateAccountSchema
} from '@presentation/http/schema/UserSchema'

export type UserDto = z.infer<typeof UserSchema> & {
  id: string
  createdAt: Date
  updatedAt: Date
}

export type UserDtoCreate = Omit<UserDto, 'id' | 'createdAt' | 'updatedAt'>

export type LoginDto = z.infer<typeof LoginSchema>

export type ActivateAccountDto = z.infer<typeof ActivateAccountSchema>
