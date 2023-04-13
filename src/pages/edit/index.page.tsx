import { darkTheme, lightTheme } from '@/utils/theme/default'
import { themeSchema } from '@/model/theme'
import { GetServerSidePropsContext } from 'next'
import { useForm } from 'react-hook-form'
import { NextPageWithLayout } from '@/pages/_app.page'
import { Layout } from '@/components/layout'
import { extractShowcaseUser, useSetUserId } from '@/utils/extractUser'
import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useThemeList } from '@/utils/theme/hooks'
import React from 'react'
import { pageTitle } from '@/utils/title'
import Head from 'next/head'
import { Editor, Form } from '@/components/Editor'
import { SEO } from '@/components/SEO'
import { useBlockLeave } from '@/components/Editor/useBlockLeave'

export const getServerSideProps = async ({
  req,
  query,
}: GetServerSidePropsContext) => {
  const { init } = query
  const userId = extractShowcaseUser(req) ?? null
  if (init === undefined || Array.isArray(init)) {
    return {
      props: {
        defaultTheme: lightTheme,
        userId,
      },
    }
  }
  try {
    const theme = JSON.parse(init)
    const checkedTheme = themeSchema.parse(theme)
    return {
      props: {
        defaultTheme: checkedTheme,
        userId,
      },
    }
  } catch (e) {
    return {
      props: {
        defaultTheme: lightTheme,
        userId,
      },
    }
  }
}

type Props = NonNullable<
  Awaited<ReturnType<typeof getServerSideProps>>['props']
>
const EditPage: NextPageWithLayout<Props> = ({ defaultTheme, userId }) => {
  useSetUserId(userId)

  const methods = useForm<Form>({
    defaultValues: {
      title: '',
      description: '',
      type: 'light',
      visibility: 'public',
      theme: defaultTheme,
    },
  })
  const { replace, asPath, push } = useRouter()
  useEffect(() => {
    if (!asPath.includes('?')) {
      return
    }
    void replace('/edit', undefined, { shallow: true })
  }, [asPath, replace])

  const { unbind } = useBlockLeave(methods.formState.isDirty)

  const {
    mutate: { createTheme },
  } = useThemeList(null, null)
  const submit = useCallback(
    async (data: Form) => {
      const newData = await createTheme(data)
      methods.reset({}, { keepValues: true })
      unbind()
      await push(`/theme/${newData.id}`)
    },
    [createTheme, methods, push, unbind]
  )

  return (
    <>
      <Head>
        <title>{pageTitle('#edit')}</title>
        <meta name='robots' content='noindex' />
        <meta name='googlebot' content='noindex' />
      </Head>
      <SEO url={`/edit`} title='#edit' description='Create a new theme' />
      <Editor userId={userId} submit={submit} {...methods} />
    </>
  )
}
EditPage.getLayout = page => <Layout noSidebar>{page}</Layout>
export default EditPage
