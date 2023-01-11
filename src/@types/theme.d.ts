import { ResolvedTheme } from '@/lib/theme'
import '@emotion/react'

declare module '@emotion/react' {
  export interface Theme {
    theme: ResolvedTheme
  }
}
