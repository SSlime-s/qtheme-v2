import '@/styles/globals.css'
import '@/styles/reset.css'
import type { AppProps } from 'next/app'
import { Inter, M_PLUS_1p } from '@next/font/google'
import { ReactElement, ReactNode } from 'react'
import { NextPage } from 'next'
import { useCurrentTheme } from '@/lib/theme/hooks'
import { ThemeProvider } from '@emotion/react'

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export const inter = Inter({
  weight: ['400', '700'],
  subsets: ['latin'],
})

export const mPlus1p = M_PLUS_1p({
  weight: ['400', '700'],
})

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (x => x)
  const { currentTheme } = useCurrentTheme()

  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily}, ${mPlus1p.style.fontFamily},
            'Avenir', 'Helvetica Neue', 'Helvetica', 'Arial', 'Hiragino Sans',
            'ヒラギノ角ゴシック', YuGothic, 'Yu Gothic', 'メイリオ', Meiryo,
            'ＭＳ Ｐゴシック', 'MS PGothic', sans-serif;

          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .mono {
          font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo,
            monospace;
        }
      `}</style>
      <ThemeProvider theme={{ theme: currentTheme }}>
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </>
  )
}
