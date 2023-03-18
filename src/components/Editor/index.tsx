import { darkTheme, lightTheme } from '@/utils/theme/default'
import { ThemeInfo } from '@/model/schema'
import styled from '@emotion/styled'
import {
  FormProvider,
  useFormContext,
  UseFormReturn,
  useWatch,
} from 'react-hook-form'
import { SidebarPortal } from '@/components/layout'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { resolveTheme } from '@/utils/theme'
import { SmallPreview } from '@/components/preview'
import { GlassmorphismStyle } from '@/components/Glassmorphism'
import React from 'react'
import { css } from '@emotion/react'
import { useNamedTabList } from '@/utils/tablist'
import { SyncControls } from './SyncControls'
import { AdvancedSelectors } from './AdvancedSelectors'
import { BasicSelectors } from './BasicSelectors'
import { Title } from './InfoEditor/Title'
import { Description } from './InfoEditor/Description'
import { Sidebar } from './Sidebar'
import { TextTheme } from './TextTheme'

const ColorsTab = ['Basic', 'Advanced'] as const

export type Form = Pick<
  ThemeInfo,
  'title' | 'description' | 'type' | 'visibility' | 'theme'
>
interface Props extends UseFormReturn<Form> {
  userId: string | null
  submit: (value: Form) => Promise<void>
}
export const Editor: React.FC<Props> = ({ userId, submit, ...methods }) => {
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
  const onSubmit = useCallback(
    async (data: Form) => {
      console.log('onSubmit', data)
      if (isSubmitting) {
        return
      }
      setIsSubmitting(true)
      try {
        await submit(data)
      } catch (e) {
        console.error(e)
      } finally {
        setIsSubmitting(false)
      }
    },
    [isSubmitting, submit]
  )
  const handleSubmit = useCallback(
    () => methods.handleSubmit(onSubmit)(),
    [methods, onSubmit]
  )

  return (
    <>
      <FormProvider {...methods}>
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
          <TextThemeBox>
            <TextTheme />
          </TextThemeBox>

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

        <SidebarPortal>
          <Sidebar submit={handleSubmit} />
        </SidebarPortal>
      </FormProvider>
    </>
  )
}

const Wrap = styled.div<{ isWide: boolean }>`
  display: grid;
  ${({ isWide }) =>
    isWide
      ? css`
          grid-template-areas: 'controls colors' 'preview colors' 'text-theme colors';
          grid-template-columns: 1fr 300px;
          grid-template-rows: max-content max-content 1fr;
        `
      : css`
          grid-template-areas: 'controls' 'preview' 'text-theme' 'colors';
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
const TextThemeBox = styled.div`
  grid-area: text-theme;
  ${GlassmorphismStyle}
  padding: 16px;
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