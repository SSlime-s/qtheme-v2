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
import { NextPageWithLayout } from '@/pages/_app'
import { Layout } from '@/components/layout'
import { extractShowcaseUser } from '@/lib/extractUser'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { resolveTheme } from '@/lib/theme'
import { SmallPreview } from '@/components/preview'
import {
  ColoredGlassmorphismStyle,
  GlassmorphismStyle,
} from '@/components/Glassmorphism'
import { useRouter } from 'next/router'
import { useCurrentTheme, useThemeList } from '@/lib/theme/hooks'
import { atom, useAtom } from 'jotai'
import { ColorSelector } from '@/components/editor/ColorSelector'
import React from 'react'
import { css } from '@emotion/react'
import { useNamedTabList } from '@/lib/tablist'
import { AdvancedSelectors } from '@/components/editor/AdvancedSelectors'
import { pageTitle } from '@/lib/title'
import Head from 'next/head'
import { BlockStyle } from '@/components/layout/Sidebar'

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
    replace('/edit', undefined, { shallow: true })
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
        push(`/theme/${newData.id}`)
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
            </Controls>
            <PreviewBox>
              <Preview userId={userId} />
              <Sync />
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
      <label htmlFor={id}>Title</label>
      <TitleInput id={id} {...register('title')} placeholder='Title' />
    </div>
  )
}
const TitleInput = styled.input`
  display: block;
  width: 100%;
  border: 1px solid ${lightTheme.basic.ui.tertiary};
  border-radius: 4px;
  backdrop-filter: blur(4px);

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
      <label htmlFor={id}>Description</label>
      <DescriptionInput
        id={id}
        {...register('description')}
        placeholder='Description'
      />
    </div>
  )
}
const DescriptionInput = styled.textarea`
  display: block;
  width: 100%;
  border: 1px solid ${lightTheme.basic.ui.tertiary};
  border-radius: 4px;
  backdrop-filter: blur(4px);
  resize: vertical;

  &:focus {
    border-color: ${lightTheme.basic.accent.primary};
  }
  &::placeholder {
    color: ${lightTheme.basic.ui.tertiary};
  }
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

const AlwaysSyncAtom = atom<boolean>(false)
const Sync: React.FC = () => {
  const {
    currentTheme,
    mutate: { changeTmpTheme, resetTmpTheme },
  } = useCurrentTheme()
  const { control, getValues } = useFormContext<Form>()
  const theme = useWatch({ control, name: 'theme' })
  const [alwaysSync, setAlwaysSync] = useAtom(AlwaysSyncAtom)
  const [isSynced, setIsSynced] = useState(false)

  useEffect(() => {
    setIsSynced(false)
  }, [theme])
  useEffect(() => {
    if (!alwaysSync) {
      return
    }
    changeTmpTheme(theme)
    setIsSynced(true)
  }, [alwaysSync, changeTmpTheme, theme])
  useEffect(() => {
    return () => {
      resetTmpTheme()
    }
  }, [resetTmpTheme])
  const sync = useCallback(() => {
    const theme = getValues('theme')
    changeTmpTheme(theme)
    setIsSynced(true)
  }, [changeTmpTheme, getValues])

  const toggleAlwaysSync = useCallback(() => {
    setAlwaysSync(prev => !prev)
  }, [setAlwaysSync])

  return (
    <SyncWrap>
      <SyncButton onClick={sync} disabled={isSynced}>
        <Dummy hidden>Synced</Dummy>
        <Real>{isSynced ? 'Synced' : 'Sync '}</Real>
      </SyncButton>
      <Label>
        <ToggleSwitch
          type='checkbox'
          checked={alwaysSync}
          onChange={toggleAlwaysSync}
        />
        Always Sync
      </Label>
    </SyncWrap>
  )
}
const SyncWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px 16px;
  flex-wrap: wrap;
`
const SyncButton = styled.button`
  ${ColoredGlassmorphismStyle(
    'rgba(0, 91, 172, 0.3)',
    'rgba(0, 91, 172, 0.1)',
    'rgba(0, 91, 172, 0.3)'
  )}

  box-shadow: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 2px 4px;
  position: relative;

  &:disabled {
    ${ColoredGlassmorphismStyle(
      'rgba(255, 255, 255, 0.3)',
      'rgba(255, 255, 255, 0.1)',
      'rgba(0, 91, 172, 0.3)'
    )}

    box-shadow: none;
    border-radius: 4px;
    cursor: default;
  }
`
const Dummy = styled.span`
  display: inline-block;
  visibility: hidden;
`
const Real = styled.span`
  display: inline-block;
  inset: 0;
  position: absolute;
  text-align: center;
`

const Label = styled.label`
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
`
const ToggleSwitch = styled.input`
  margin-right: 2px;

  height: 16px;
  width: 32px;
  position: relative;
  cursor: pointer;

  &:before {
    content: '';
    position: absolute;
    inset: 4px;
    background-color: rgba(255, 255, 255, 0.3);
    border: 1px solid rgba(0, 91, 172, 0.4);
    border-radius: 4px;
    transition: background-color 0.2s ease-out;
  }
  &:checked:before {
    background-color: rgba(0, 91, 172, 0.3);
  }

  &:after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    top: 0;
    left: 0;
    border-radius: 50%;
    background-color: rgba(255, 255, 255);
    border: 1px solid rgba(0, 91, 172, 0.4);
    transition: transform 0.2s ease-out, background-color 0.2s ease-out;
  }
  &:checked:after {
    transform: translateX(16px);
    background-color: rgba(0, 91, 172);
  }
`

const BasicKeys = {
  accent: ['primary', 'notification', 'online', 'error', 'focus'] as const,
  background: ['primary', 'secondary', 'tertiary'] as const,
  ui: ['primary', 'secondary', 'tertiary'] as const,
  text: ['primary', 'secondary'] as const,
} as const
const BasicKeysKeys = [
  'accent',
  'background',
  'ui',
  'text',
] as const satisfies ReadonlyArray<keyof typeof BasicKeys>
const BasicSelectors: React.FC = () => {
  const { control, setValue, getValues } = useFormContext<Form>()
  const theme = useWatch({ control, name: 'theme' })
  const basicTheme = useMemo(() => {
    return theme.basic
  }, [theme])
  const resolvedTheme = useMemo(() => {
    return resolveTheme(theme)
  }, [theme])

  const setBasicTheme = useCallback(
    (newTheme: Partial<Theme['basic']>) => {
      const prev = getValues('theme')
      setValue(
        'theme',
        { ...prev, basic: { ...prev.basic, ...newTheme } },
        {
          shouldDirty: true,
        }
      )
    },
    [getValues, setValue]
  )

  const [expanded, setExpanded] = useState<string>()

  return (
    <div>
      {BasicKeysKeys.map(key1 => (
        <SelectorGroup key={key1}>
          <SelectorGroupLabel>{key1}</SelectorGroupLabel>
          {BasicKeys[key1].map(key2 => (
            <Selector key={key2}>
              <SelectorLabel>{key2}</SelectorLabel>
              <ColorSelector
                // @ts-expect-error: TODO: key の chain をうまく認識できてない
                value={resolvedTheme.basic[key1][key2].default}
                onChange={color => {
                  setBasicTheme({
                    [key1]: {
                      ...basicTheme[key1],
                      [key2]: color,
                    },
                  })
                }}
                isExpanded={expanded === `${key1}.${key2}`}
                setExpanded={v =>
                  setExpanded(v ? `${key1}.${key2}` : undefined)
                }
              />
            </Selector>
          ))}
        </SelectorGroup>
      ))}
    </div>
  )
}
const SelectorGroup = styled.div`
  margin-bottom: 16px;
`
const SelectorGroupLabel = styled.div`
  font-weight: bold;
  color: #111;
  margin-bottom: 8px;
  letter-spacing: 0.0625em;
`
const Selector = styled.div`
  margin-bottom: 8px;
  padding-left: 8px;
`
const SelectorLabel = styled.div`
  color: #333;
  margin-bottom: 4px;
`
