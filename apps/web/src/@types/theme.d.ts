import type { ResolvedTheme } from '@/utils/theme'
import '@emotion/react'

declare module '@emotion/react' {
  export interface Theme {
    theme: ResolvedTheme
  }
}
