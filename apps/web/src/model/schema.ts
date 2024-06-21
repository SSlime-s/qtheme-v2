import { themeSchema } from '@repo/theme'
import { z } from 'zod'

export const ulidSchema = z.string().uuid()

export const themeTypeSchema = z.union([z.literal('light'), z.literal('dark')])
export const visibilityTypeSchema = z.union([
  z.literal('public'),
  z.literal('private'),
  z.literal('draft'),
])

export const themeInfoSchema = z.object({
  id: ulidSchema,
  title: z.string(),
  description: z.string(),
  author_user_id: z.string(),
  visibility: visibilityTypeSchema,
  type: themeTypeSchema,
  created_at: z.date(),
  theme: themeSchema,
  likes: z.number(),
})
export type ThemeInfo = z.infer<typeof themeInfoSchema>
