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
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react'
import { resolveTheme } from '@/lib/theme'
import { SmallPreview } from '@/components/preview'
import {
  ColoredGlassmorphismStyle,
  GlassmorphismStyle,
} from '@/components/Glassmorphism'
import { useRouter } from 'next/router'
import { useCurrentTheme } from '@/lib/theme/hooks'
import { atom, useAtom } from 'jotai'
import { ColorSelector } from '@/components/editor/ColorSelector'
import React from 'react'
import { css } from '@emotion/react'
import { useNamedTabList } from '@/lib/tablist'
import { useControlledAccordion } from '@/lib/accordion'

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
type Form = Pick<
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
  const { replace, asPath } = useRouter()
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

  return (
    <FormProvider {...methods}>
      <Wrap>
        <Rest>
          <Title />
          <Preview userId={userId} />
          <Sync />
        </Rest>
        <Colors>
          <Tabs {...ariaTabListProps}>
            <Tab {...ariaTabProps.Basic} onClick={selectBasicTab} title='Basic'>
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
    </FormProvider>
  )
}
Editor.getLayout = page => <Layout>{page}</Layout>
export default Editor

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-height: 100%;
  gap: 16px;
  padding: 16px;
  position: relative;
`
const Rest = styled.div`
  ${GlassmorphismStyle}

  flex: 1e10 1 450px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: max-content;
  position: sticky;
  top: 16px;
  z-index: 10;
`
const Colors = styled.div`
  ${GlassmorphismStyle}

  flex: 1 1 300px;
  padding: 16px;
`
const Tabs = styled.div`
  display: grid;
  background-color: rgba(230, 230, 230, 0.5);
  backdrop-filter: blur(8px);
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin: -16px -16px 16px;
  padding: 16px 16px 0;
`
const Tab = styled.button`
  transition: all 0.2s ease-out;
  color: #888;
  border-bottom: 2px solid;
  border-color: transparent;
  padding: 4px 16px;
  margin-bottom: -1px;
  width: max-content;
  cursor: pointer;
  &:first-of-type {
    justify-self: end;
  }
  &:last-of-type {
    justify-self: start;
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
  border: 1px solid ${({ theme }) => theme.theme.basic.ui.tertiary.default};
  border-radius: 4px;
  backdrop-filter: blur(8px);

  &:focus {
    border-color: ${({ theme }) => theme.theme.basic.accent.primary.default};
  }
  &::placeholder {
    color: ${({ theme }) => theme.theme.basic.ui.tertiary.default};
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
    <div>
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
    </div>
  )
}
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
  margin-right: 4px;

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

const AdvancedKeys = {
  browser: [
    'themeColor',
    // 'colorScheme',
    'selectionText',
    'selectionBackground',
    'caret',
    'scrollbarThumb',
    'scrollbarTrack',
  ] as const,
  specific: [
    'waveformColor',
    'waveformGradation',

    'navigationBarDesktopBackground',
    'navigationBarMobileBackground',
    'mainViewBackground',
    'sideBarBackground',

    'stampEdgeEnable',
  ] as const,
} as const
const AdvancedKeysKeys = [
  'browser',
  'specific',
] as const satisfies ReadonlyArray<keyof typeof AdvancedKeys>
const AdvancedSelectors: React.FC = () => {
  const { control, setValue, getValues } = useFormContext<Form>()
  const theme = useWatch({ control, name: 'theme' })

  return (
    <div>
      <SelectorGroup>
        <SelectorGroupLabel>Browser</SelectorGroupLabel>
        <OptionalSelectors label='Browser' />
        {AdvancedKeys.browser.map(key => (
          <Selector key={key}>
            <SelectorLabel>{key}</SelectorLabel>
          </Selector>
        ))}

        <SelectorGroupLabel>Specific</SelectorGroupLabel>
        {AdvancedKeys.specific.map(key => (
          <Selector key={key}>
            <SelectorLabel>{key}</SelectorLabel>
          </Selector>
        ))}
      </SelectorGroup>
    </div>
  )
}

interface OptionalSelectorsProps {
  label: string
}
const OptionalSelectors: React.FC<OptionalSelectorsProps> = ({ label }) => {
  const [valid, setValid] = useState(false)
  const { toggle, ariaContent, ariaToggle, contentHeight, contentRef } =
    useControlledAccordion(valid, setValid)

  return (
    <OptionalSelectorWrap valid={valid}>
      <OptionalSelectorsLabel {...ariaToggle} onClick={toggle}>
        <OptionalSelectorsIcon />
        {label}
        <OptionalSelectorsDisableText>無効化中</OptionalSelectorsDisableText>
      </OptionalSelectorsLabel>
      <OptionalSelectorsContent {...ariaContent} height={contentHeight ?? 0}>
        <div ref={contentRef}>
          <div>test</div>
        </div>
      </OptionalSelectorsContent>
    </OptionalSelectorWrap>
  )
}
const OptionalSelectorWrap = styled.div<{ valid: boolean }>`
  transition: all 0.2s ease-out;
  transform: ${({ valid }) => (valid ? 'none' : 'translateX(16px)')};
`
const OptionalSelectorsLabel = styled.button`
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 8px;
`
const OptionalSelectorsIcon = styled.div`
  width: 16px;
  height: 16px;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 1px;
    background-color: #333;
    transform-origin: center;
    transition: all 0.2s ease-out, transform 0.2s ease-out;
  }
  &::before {
    width: 16px;
    height: 2px;
    top: 7px;
    left: 0;
  }
  &::after {
    width: 2px;
    height: 16px;
    top: 0;
    left: 7px;
  }

  [aria-expanded='true'] > &::before {
    transform: rotate(225deg) scale(1.4, 1);
  }
  [aria-expanded='true'] > &::after {
    transform: rotate(225deg) scale(1, 1.4);
  }
`
const OptionalSelectorsDisableText = styled.span`
  color: #333;
  font-size: 12px;
  transition: color 0.2s ease-out;

  [aria-expanded='true'] > & {
    color: transparent;
  }
`
const OptionalSelectorsContent = styled.div<{ height: number }>`
  overflow: hidden;
  transition: height 0.2s ease-out;
  height: ${({ height }) => height}px;

  &[aria-hidden='true'] {
    height: 0;
  }
`