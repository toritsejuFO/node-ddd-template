import { ZodError, ZodIssue } from 'zod'

const formatZodIssue = (issue: ZodIssue): object => {
  const { path, message } = issue

  return {
    field: path.join('.'),
    message: message
  }
}

// Format the Zod error message with only the current error
export const formatZodError = (error: ZodError): object => {
  const { issues } = error
  return issues.map(formatZodIssue)
}
