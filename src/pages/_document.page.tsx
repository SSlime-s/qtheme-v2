import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='ja'>
      <Head />
      <body>
        <Main />
        <div id='toast' />
        <div id='modal' />
        <NextScript />
      </body>
    </Html>
  )
}
