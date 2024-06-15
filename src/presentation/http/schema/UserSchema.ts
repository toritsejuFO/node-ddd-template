import { z } from 'zod'

export const UserSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  password: z.string()
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export const ActivateAccountSchema = z.object({
  token: z.string()
})
