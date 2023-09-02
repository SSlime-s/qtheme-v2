import { googleTagManagerId } from '@/utils/gtm'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='ja'>
      <Head />
      <body>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <iframe
                src="https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}"
                height="0"
                width="0"
                style="display:none;visibility:hidden"
              />`,
          }}
        />
        <Main />
        <div id='toast' />
        <div id='modal' />
        <NextScript />
      </body>
    </Html>
  )
}
