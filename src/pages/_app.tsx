import '@/styles/globals.css'
import '@/styles/reset.css'
import type { AppProps } from 'next/app'
import { Roboto, Roboto_Mono } from '@next/font/google'
import { ReactElement, ReactNode } from 'react'
import { NextPage } from 'next'
import { useTheme } from '@/lib/theme/hooks'
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

export const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
})

export const robotoMono = Roboto_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
})

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (x => x)
  const { currentTheme } = useTheme()

  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${roboto.style.fontFamily};
        }

        .mono {
          font-family: ${robotoMono.style.fontFamily};
        }
      `}</style>
      <ThemeProvider theme={{ theme: currentTheme }}>
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </>
  )
}
