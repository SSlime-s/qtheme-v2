import '@/styles/reset.css'
import { css, Global, ThemeProvider } from '@emotion/react'
import { atom, useAtom } from 'jotai'
import { Inter, M_PLUS_1p } from 'next/font/google'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { GoogleTagManager } from '@/components/Editor/GoogleTagManager'
import { SEO } from '@/components/SEO'
import { googleTagManagerId } from '@/utils/gtm'
import { isMobile } from '@/utils/isMobile'
import { useCurrentTheme } from '@/utils/theme/hooks'

import type { GoogleTagManagerId } from '@/components/Editor/GoogleTagManager'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'

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
  preload: false,
})

export const fixLayoutAtom = atom<boolean>(false)
export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (x => x)
  const { currentTheme } = useCurrentTheme()
  const router = useRouter()
  const key = router.pathname !== '/edit' ? 'default' : `edit ${router.asPath}`

  const [isFixed] = useAtom(fixLayoutAtom)

  return (
    <>
      <GoogleTagManager
        googleTagManagerId={googleTagManagerId as GoogleTagManagerId}
      />
      <Head>
        <title>QTheme v2</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
        <meta name='theme-color' content='#fff' />
      </Head>
      <SEO type='website' />
      <Global styles={isFixed ? GlobalStyleFixed : GlobalStyleNotFixed} />
      <ThemeProvider theme={{ theme: currentTheme }}>
        {getLayout(<Component key={key} {...pageProps} />)}
      </ThemeProvider>
    </>
  )
}
const GlobalStyle = (isFixed: boolean) => css`
  html {
    font-family: ${inter.style.fontFamily}, ${mPlus1p.style.fontFamily},
      'Avenir', 'Helvetica Neue', 'Helvetica', 'Arial', 'Hiragino Sans',
      'ヒラギノ角ゴシック', YuGothic, 'Yu Gothic', 'メイリオ', Meiryo,
      'ＭＳ Ｐゴシック', 'MS PGothic', sans-serif;

    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  .mono {
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
  }

  html,
  body {
    max-width: 100vw;
    overflow-x: hidden;
    height: 100%;

    ${isMobile} {
      ${isFixed
        ? css`
            overflow-x: hidden;
          `
        : css`
            overflow-x: auto;
            overflow-x: overlay;
          `}
      scroll-snap-type: x mandatory;
    }
  }

  #__next {
    height: 100%;
  }

  scrollbar-color: rgba(107, 125, 138, 0.5) transparent;
  &:hover,
  &:active {
    scrollbar-color: rgba(107, 125, 138, 0.8) transparent;
  }

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  scrollbar-width: thin;

  &::-webkit-scrollbar-track {
    background: transparent;
    &:hover {
      background: transparent;
    }
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(107, 125, 138, 0.5);
    transition: background 0.3s;
    border-radius: 3px;
    &:hover {
      background: rgba(107, 125, 138, 0.8);
    }
  }
  &::-webkit-scrollbar-corner {
    visibility: hidden;
    display: none;
  }
`
const GlobalStyleFixed = GlobalStyle(true)
const GlobalStyleNotFixed = GlobalStyle(false)
