import { z } from 'zod'

export const NewUserSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8)
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export const ActivateAccountSchema = z.object({
  token: z.string()
})
