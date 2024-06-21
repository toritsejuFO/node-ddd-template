import { z } from 'zod'

import {
  LoginSchema,
  NewUserSchema,
  ActivateAccountSchema
} from '@presentation/http/schema/UserSchema'

export type NewUserDto = z.infer<typeof NewUserSchema>

type NonCreationFields = {
  id: string
  isEmailVerified: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type UserDto = z.mergeTypes<NewUserDto, NonCreationFields>

export type LoginDto = z.infer<typeof LoginSchema>

export type ActivateAccountDto = z.infer<typeof ActivateAccountSchema>
