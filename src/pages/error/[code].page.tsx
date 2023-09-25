import { Error } from '@/components/Error'
import { Layout } from '@/components/layout'

import type { NextPageWithLayout } from '@/pages/_app.page'
import type { GetStaticPaths, GetStaticProps } from 'next'
import type { ParsedUrlQuery } from 'querystring'

interface Params extends ParsedUrlQuery {
  code: string
}

export const getStaticProps = (async ({ params }) => {
  const statusCode = Number(params?.code)

  return {
    props: {
      code: Number.isNaN(statusCode) ? 500 : statusCode,
    },
  }
}) satisfies GetStaticProps<
  {
    code: number
  },
  Params
>

export const getStaticPaths = (async () => {
  return {
    paths: [
      {
        params: {
          code: '401',
        },
      },
      {
        params: {
          code: '403',
        },
      },
      {
        params: {
          code: '404',
        },
      },
      {
        params: {
          code: '500',
        },
      },
    ],
    fallback: true,
  }
}) satisfies GetStaticPaths<Params>

type Props = NonNullable<Awaited<ReturnType<typeof getStaticProps>>['props']>

const ErrorPage: NextPageWithLayout<Props> = ({ code }) => {
  return <Error statusCode={code} />
}
ErrorPage.getLayout = page => <Layout>{page}</Layout>

export default ErrorPage