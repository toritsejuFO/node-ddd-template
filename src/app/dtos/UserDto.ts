import { z } from 'zod'

import { UserSchema } from '../../presentation/http/schema/UserSchema'

export type UserDto = z.infer<typeof UserSchema> & {
  id: string
  createdAt: Date
  updatedAt: Date
}

export type UserDtoCreate = Omit<UserDto, 'id' | 'createdAt' | 'updatedAt'>
