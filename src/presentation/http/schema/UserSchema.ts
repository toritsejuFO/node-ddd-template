import { z } from 'zod'

export const NewUserSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*]).{8,}$/,
      'Password must contain at least one uppercase, one lowercase, one number and one special character'
    )
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export const ActivateAccountSchema = z.object({
  token: z.string()
})
