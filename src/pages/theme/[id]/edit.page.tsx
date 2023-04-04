import { Editor, Form } from '@/components/Editor'
import { Layout } from '@/components/layout'
import { NextPageWithLayout } from '@/pages/_app.page'
import { extractShowcaseUser, useSetUserId } from '@/utils/extractUser'
import { FormattedTheme, useTheme } from '@/utils/theme/hooks'
import { pageTitle } from '@/utils/title'
import { GetServerSidePropsContext } from 'next'
import { Error } from '@/components/Error'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const userId = extractShowcaseUser(req)

  return {
    props: {
      userId: userId ?? null,
    },
  }
}

type Props = NonNullable<
  Awaited<ReturnType<typeof getServerSideProps>>['props']
>
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
        </Head>
        <div>Loading ...</div>
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
      </Head>
      <Edit defaultTheme={theme} updateTheme={updateTheme} userId={userId} />
    </>
  )
}
ThemeEditPage.getLayout = page => <Layout noSidebar>{page}</Layout>
export default ThemeEditPage

interface EditProps {
  defaultTheme: FormattedTheme
  updateTheme: (
    theme: Pick<
      FormattedTheme,
      'type' | 'title' | 'description' | 'visibility' | 'theme'
    >
  ) => Promise<void>
  userId: string | null
}
const Edit: React.FC<EditProps> = ({ defaultTheme, updateTheme, userId }) => {
  const methods = useForm<Form>({
    defaultValues: {
      title: defaultTheme.title,
      description: defaultTheme.description,
      type: defaultTheme.type === 'other' ? 'light' : defaultTheme.type,
      visibility: defaultTheme.visibility,
      theme: defaultTheme.theme,
    },
  })

  const submit = useCallback(
    async (data: Form) => {
      await updateTheme(data)
    },
    [updateTheme]
  )

  return (
    <>
      <Editor userId={userId} submit={submit} {...methods} />
    </>
  )
}
