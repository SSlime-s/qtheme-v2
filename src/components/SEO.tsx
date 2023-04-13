import { BASE_URL } from '@/utils/baseUrl'
import { FormattedTheme } from '@/utils/theme/hooks'
import Head from 'next/head'
import { PropsWithChildren } from 'react'

export const ogImageUrl = (
  theme: FormattedTheme['theme'],
  author: string
): `/api/og?theme=${string}&author=${string}` => {
  return `/api/og?theme=${encodeURIComponent(
    JSON.stringify(theme)
  )}&author=${author}`
}

type Props =
  | {
      type: 'website'
      title?: never
      description?: never
      imageUrl?: never
      url?: never
    }
  | {
      type?: 'article'
      title?: string
      description?: string
      imageUrl?: string
      url?: string
    }
export const SEO: React.FC<PropsWithChildren<Props>> = ({
  type = 'article',
  title = 'QTheme v2',
  description = 'traQ のテーマ作成・公開サービス',
  imageUrl = `/api/og`,
  url = '/',
  children,
}) => {
  return (
    <Head>
      <meta property='og:type' content={type} key='og:type' />
      <meta property='og:sitename' content='QTheme v2' key='og:sitename' />
      <meta property='og:title' content={title} key='og:title' />
      <meta name='description' content={description} key='description' />
      <meta
        property='og:description'
        content={description}
        key='og:description'
      />
      <meta
        property='og:image'
        content={`${BASE_URL}${imageUrl}`}
        key='og:image'
      />
      <meta property='og:url' content={`${BASE_URL}${url}`} key='og:url' />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:site' content='@_SSlime' />
      {children}
    </Head>
  )
}
