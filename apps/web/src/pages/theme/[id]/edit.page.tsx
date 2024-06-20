import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { Editor } from '@/components/Editor'
import { useBlockLeave } from '@/components/Editor/useBlockLeave'
import { Error } from '@/components/Error'
import { LoadingBar } from '@/components/LoadingBar'
import { SEO } from '@/components/SEO'
import { Layout } from '@/components/layout'
import { extractShowcaseUser } from '@/utils/extractUser'
import { useTheme } from '@/utils/theme/hooks'
import { pageTitle } from '@/utils/title'
import { useSetUserId } from '@/utils/userId'

import type { Form } from '@/components/Editor'
import type { NextPageWithLayout } from '@/pages/_app.page'
import type { FormattedTheme } from '@/utils/theme/hooks'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'

export const getServerSideProps = (async ({ req }) => {
  const userId = extractShowcaseUser(req)

  return {
    props: {
      userId: userId ?? null,
    },
  }
}) satisfies GetServerSideProps

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const ThemeEditPage: NextPageWithLayout<Props> = ({ userId }) => {
  useSetUserId(userId)

  const { id } = useRouter().query as { id: string }
  const {
    theme,
    mutate: { updateTheme },
  } = useTheme(id)

  if (userId === null) {
    return (
      <>
        <Error statusCode={401} />
      </>
    )
  }

  if (theme === undefined) {
    return (
      <>
        <Head>
          <title>{pageTitle('#edit')}</title>
          <meta name='robots' content='noindex' />
          <meta name='googlebot' content='noindex' />
        </Head>
        <SEO url={`/theme/${id}/edit`} />
        <LoadingBar />
      </>
    )
  }

  if (userId !== theme?.author) {
    return (
      <>
        <Error statusCode={403} />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{pageTitle(`#edit - ${theme.title}`)}</title>
        <meta name='robots' content='noindex' />
        <meta name='googlebot' content='noindex' />
      </Head>
      <SEO url={`/theme/${id}/edit`} />
      <Edit
        id={id}
        defaultTheme={theme}
        updateTheme={updateTheme}
        userId={userId}
      />
    </>
  )
}
ThemeEditPage.getLayout = page => <Layout noSidebar>{page}</Layout>
export default ThemeEditPage

interface EditProps {
  id: string
  defaultTheme: FormattedTheme
  updateTheme: (
    theme: Pick<
      FormattedTheme,
      'type' | 'title' | 'description' | 'visibility' | 'theme'
    >
  ) => Promise<void>
  userId: string | null
}
const Edit: React.FC<EditProps> = ({
  id,
  defaultTheme,
  updateTheme,
  userId,
}) => {
  const methods = useForm<Form>({
    defaultValues: {
      title: defaultTheme.title,
      description: defaultTheme.description,
      type: defaultTheme.type === 'other' ? 'light' : defaultTheme.type,
      visibility: defaultTheme.visibility,
      theme: defaultTheme.theme,
    },
  })

  const { push } = useRouter()

  const { unbind } = useBlockLeave(methods.formState.isDirty)

  const submit = useCallback(
    async (data: Form) => {
      await updateTheme(data)
      methods.reset({}, { keepValues: true })
      unbind()
      await push(`/theme/${id}`)
    },
    [id, methods, push, unbind, updateTheme]
  )

  return (
    <>
      <Editor userId={userId} submit={submit} {...methods} />
    </>
  )
}
