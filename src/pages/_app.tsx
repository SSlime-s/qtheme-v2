import '@/styles/globals.css'
import '@/styles/reset.css'
import type { AppProps } from 'next/app'
import { Roboto, Roboto_Mono } from '@next/font/google'

export const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
})

export const robotoMono = Roboto_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
})

export default function App({ Component, pageProps }: AppProps) {
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
      <Component {...pageProps} />
    </>
  )
}
