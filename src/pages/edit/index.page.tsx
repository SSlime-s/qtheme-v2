import { darkTheme, lightTheme } from '@/lib/theme/default'
import { ThemeInfo } from '@/model/schema'
import { Theme, themeSchema } from '@/model/theme'
import styled from '@emotion/styled'
import { GetServerSidePropsContext } from 'next'
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form'
import { NextPageWithLayout } from '@/pages/_app.page'
import { Layout } from '@/components/layout'
import { extractShowcaseUser } from '@/lib/extractUser'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { resolveTheme } from '@/lib/theme'
import { SmallPreview } from '@/components/preview'
import { GlassmorphismStyle } from '@/components/Glassmorphism'
import { useRouter } from 'next/router'
import { useThemeList } from '@/lib/theme/hooks'
import React from 'react'
import { css } from '@emotion/react'
import { useNamedTabList } from '@/lib/tablist'
import { pageTitle } from '@/lib/title'
import Head from 'next/head'
import { BlockStyle } from '@/components/layout/Sidebar'
import { AutoResizeTextarea } from '@/components/AutoResizeTextarea'
import { SyncControls } from './SyncControls'
import { ColorSelector } from './ColorSelector'
import { AdvancedSelectors } from './AdvancedSelectors'
import { BasicSelectors } from './BasicSelectors'

export const getServerSideProps = async ({
  req,
  query,
}: GetServerSidePropsContext) => {
  const { init } = query
  const userId = extractShowcaseUser(req)
  if (init === undefined || Array.isArray(init)) {
    return {
      props: {
        defaultTheme: lightTheme,
        userId: userId ?? null,
      },
    }
  }
  try {
    const theme = JSON.parse(init)
    const checkedTheme = themeSchema.parse(theme)
    return {
      props: {
        defaultTheme: checkedTheme,
        userId: userId ?? null,
      },
    }
  } catch (e) {
    return {
      props: {
        defaultTheme: lightTheme,
        userId: userId ?? null,
      },
    }
  }
}

type Props = NonNullable<
  Awaited<ReturnType<typeof getServerSideProps>>['props']
>
export type Form = Pick<
  ThemeInfo,
  'title' | 'description' | 'type' | 'visibility' | 'theme'
>
const ColorsTab = ['Basic', 'Advanced'] as const
const Editor: NextPageWithLayout<Props> = ({ defaultTheme, userId }) => {
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

  const { ariaPanelProps, ariaTabListProps, ariaTabProps, switchTab } =
    useNamedTabList(ColorsTab)

  const selectBasicTab = useCallback(() => switchTab('Basic'), [switchTab])
  const selectAdvancedTab = useCallback(
    () => switchTab('Advanced'),
    [switchTab]
  )

  const [isWide, setIsWide] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const container = containerRef.current
    if (container === null) {
      return
    }
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width } = entry.contentRect
        setIsWide(width > 450 + 300 + 16 * 3)
      }
    })
    observer.observe(container)
    return () => {
      observer.disconnect()
    }
  }, [])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    mutate: { createTheme, updateTheme },
  } = useThemeList(null, null, null)
  const onSubmit = useCallback(
    async (data: Form) => {
      if (isSubmitting) {
        return
      }
      setIsSubmitting(true)
      try {
        const newData = await createTheme(data)
        await push(`/theme/${newData.id}`)
      } catch (e) {
        console.error(e)
      } finally {
        setIsSubmitting(false)
      }
    },
    [createTheme, isSubmitting, push]
  )
  const submit = useCallback(
    () => methods.handleSubmit(onSubmit)(),
    [methods, onSubmit]
  )

  return (
    <>
      <Head>
        <title>{pageTitle('#edit')}</title>
      </Head>
      <FormProvider {...methods}>
        <Layout
          sidebar={
            <>
              <SubmitButton onClick={submit}>Submit</SubmitButton>
            </>
          }
        >
          <Wrap ref={containerRef} isWide={isWide}>
            <Controls>
              <Title />
              <Description />
              <Selects />
            </Controls>
            <PreviewBox>
              <Preview userId={userId} />
              <SyncControls />
            </PreviewBox>

            <Colors>
              <Tabs {...ariaTabListProps}>
                <Tab
                  {...ariaTabProps.Basic}
                  onClick={selectBasicTab}
                  title='Basic'
                >
                  Basic
                </Tab>
                <Tab
                  {...ariaTabProps.Advanced}
                  onClick={selectAdvancedTab}
                  title='Advanced'
                >
                  Advanced
                </Tab>
              </Tabs>

              <TabPanel {...ariaPanelProps.Basic}>
                <BasicSelectors />
              </TabPanel>
              <TabPanel {...ariaPanelProps.Advanced}>
                <AdvancedSelectors />
              </TabPanel>
            </Colors>
          </Wrap>
        </Layout>
      </FormProvider>
    </>
  )
}
export default Editor

const SubmitButton = styled.button`
  ${BlockStyle}
  cursor: pointer;
`
const Wrap = styled.div<{ isWide: boolean }>`
  display: grid;
  ${({ isWide }) =>
    isWide
      ? css`
          grid-template-areas: 'controls colors' 'preview colors';
          grid-template-columns: 1fr 300px;
          grid-template-rows: max-content 1fr;
        `
      : css`
          grid-template-areas: 'controls' 'preview' 'colors';
        `}
  min-height: 100%;
  gap: 16px;
  padding: 16px;
  position: relative;
`
const Controls = styled.div`
  grid-area: controls;
  ${GlassmorphismStyle}
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`
const PreviewBox = styled.div`
  grid-area: preview;
  ${GlassmorphismStyle}
  padding: 16px;

  display: flex;
  flex-direction: column;
  gap: 8px;
  position: sticky;
  top: 16px;
  z-index: 10;
  margin-bottom: auto;
`
const Colors = styled.div`
  grid-area: colors;
  ${GlassmorphismStyle}

  padding: 16px;
`
const Tabs = styled.div`
  display: flex;
  background-color: rgba(230, 230, 230, 0.5);
  backdrop-filter: blur(8px);
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin: -16px -16px 16px;
  padding: 16px 16px 0;
  overflow-x: auto;
  overscroll-behavior-x: contain;
`
const Tab = styled.button`
  transition: all 0.2s ease-out;
  color: #888;
  border-bottom: 2px solid;
  border-color: transparent;
  padding: 4px 16px;
  width: max-content;
  cursor: pointer;
  &:first-of-type {
    margin-left: auto;
  }
  &:last-of-type {
    margin-right: auto;
  }
  &[aria-selected='true'],
  &[aria-selected='true']:hover {
    color: #000;
    border-color: #000;
  }
  &:hover {
    color: #222;
    border-color: #222;
  }
`
const TabPanel = styled.div``

const Title: React.FC = () => {
  const id = useId()
  const { register } = useFormContext<Form>()

  return (
    <div>
      <TitleLabel htmlFor={id}>Title</TitleLabel>
      <TitleInput id={id} {...register('title')} placeholder='Title' />
    </div>
  )
}
const TitleLabel = styled.label`
  display: block;
  margin-bottom: 4px;
`
const TitleInput = styled.input`
  display: block;
  width: 100%;
  border: 1px solid ${lightTheme.basic.ui.tertiary};
  border-radius: 4px;
  backdrop-filter: blur(4px);
  padding: 4px 8px;

  &:focus {
    border-color: ${lightTheme.basic.accent.primary};
  }
  &::placeholder {
    color: ${lightTheme.basic.ui.tertiary};
  }
`
const Description: React.FC = () => {
  const id = useId()
  const { register } = useFormContext<Form>()

  return (
    <div>
      <DescriptionLabel htmlFor={id}>Description</DescriptionLabel>
      <DescriptionInput
        id={id}
        {...register('description')}
        placeholder='Description'
      />
    </div>
  )
}
const DescriptionLabel = TitleLabel
const DescriptionInput = styled(AutoResizeTextarea)`
  width: 100%;
  border: 1px solid ${lightTheme.basic.ui.tertiary};
  border-radius: 4px;
  backdrop-filter: blur(4px);
  padding: 4px 8px;

  &:focus {
    border-color: ${lightTheme.basic.accent.primary};
  }
  &::placeholder {
    color: ${lightTheme.basic.ui.tertiary};
  }
`
const visibilityDescription = {
  public: 'traP 外の人でも見ることができます',
  private: 'traP 内の人だけが見ることができます',
  draft: 'あなただけが見ることができます',
} as const satisfies Record<'public' | 'private' | 'draft', string>
const Selects: React.FC = () => {
  const { control, register } = useFormContext<Form>()
  const visibility = useWatch({
    control,
    name: 'visibility',
  })

  return (
    <>
      <SelectsWrap>
        <Select {...register('type')}>
          <option value='light'>Light</option>
          <option value='dark'>Dark</option>
        </Select>
        <Select {...register('visibility')}>
          <option value='public'>Public</option>
          <option value='private'>Private</option>
          <option value='draft'>Draft</option>
        </Select>
      </SelectsWrap>
      <span>{visibilityDescription[visibility]}</span>
    </>
  )
}
const SelectsWrap = styled.div`
  display: flex;
  gap: 16px;
`
const Select = styled.select`
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid ${lightTheme.basic.ui.tertiary};
  backdrop-filter: blur(4px);
  appearance: menulist;
  transition: all 0.2s ease-out;

  &:hover {
    border-color: ${lightTheme.basic.ui.secondary};
  }
  &:focus {
    border-color: ${lightTheme.basic.accent.primary};
  }

  cursor: pointer;
`

const Preview: React.FC<{ userId: string | null }> = ({ userId }) => {
  const { control } = useFormContext<Form>()
  const theme = useWatch({ control, name: 'theme' })
  const resolvedTheme = useMemo(() => {
    return resolveTheme(theme)
  }, [theme])

  return (
    <div
      css={css`
        max-width: 400px;
      `}
    >
      <SmallPreview author={userId ?? 'traP'} theme={resolvedTheme} />
    </div>
  )
}
