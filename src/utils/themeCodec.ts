import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string'
import { z } from 'zod'
import { themeSchema } from '@/model/theme'

const shareThemeScheme = z.object({
  title: z.string(),
  description: z.string(),
  type: z.enum(['dark', 'light']),
  theme: themeSchema,
})
type ShareTheme = z.infer<typeof shareThemeScheme>

export const encodeTheme = (theme: ShareTheme): string => {
  return compressToEncodedURIComponent(
    JSON.stringify(shareThemeScheme.parse(theme))
  )
}

export const decodeTheme = (encoded: string): ShareTheme | Error => {
  try {
    const decoded = JSON.parse(decompressFromEncodedURIComponent(encoded))
    return shareThemeScheme.parse(decoded)
  } catch (e) {
    return new Error('Failed to decode theme')
  }
}
