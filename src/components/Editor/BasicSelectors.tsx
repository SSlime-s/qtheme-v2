import styled from '@emotion/styled'
import { useCallback, useMemo, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import { ColorSelector } from './ColorSelector'

import type { Form } from '@/components/Editor'
import type { Theme } from '@/model/theme'

import { resolveTheme } from '@/utils/theme'

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
export const BasicSelectors: React.FC = () => {
  const { control, setValue, getValues } = useFormContext<Form>()
  const theme = useWatch({ control, name: 'theme' })
  const resolvedTheme = useMemo(() => {
    return resolveTheme(theme)
  }, [theme])

  const setBasicTheme = useCallback(
    (
      newTheme:
        | Partial<Theme['basic']>
        | ((prev: Theme['basic']) => Partial<Theme['basic']>)
    ) => {
      const prev = getValues('theme')
      const newThemeResolved =
        typeof newTheme === 'function' ? newTheme(prev.basic) : newTheme

      setValue(
        'theme',
        { ...prev, basic: { ...prev.basic, ...newThemeResolved } },
        {
          shouldDirty: true,
        }
      )
    },
    [getValues, setValue]
  )

  const [expanded, setExpanded] = useState<string>()

  const onChangeWrap = useCallback(
    (
      value: string,
      key1: keyof typeof BasicKeys,
      key2: (typeof BasicKeys)[keyof typeof BasicKeys][number]
    ) => {
      setBasicTheme(prev => ({
        [key1]: {
          ...prev[key1],
          [key2]: value,
        },
      }))
    },
    [setBasicTheme]
  )
  const setExpandedWrap = useCallback(
    (
      v: boolean,
      key1: keyof typeof BasicKeys,
      key2: (typeof BasicKeys)[keyof typeof BasicKeys][number]
    ) => {
      setExpanded(v ? `${key1}.${key2}` : undefined)
    },
    [setExpanded]
  )

  return (
    <div>
      {BasicKeysKeys.map(key1 => (
        <SelectorGroup key={key1}>
          <SelectorGroupLabel>{key1}</SelectorGroupLabel>
          {BasicKeys[key1].map(key2 => (
            <Selector key={key2}>
              <SelectorLabel>{key2}</SelectorLabel>
              <ColorSelectorWrap
                key1={key1}
                key2={key2}
                // @ts-expect-error: TODO: key の chain をうまく認識できてない
                value={resolvedTheme.basic[key1][key2].default}
                onChange={onChangeWrap}
                isExpanded={expanded === `${key1}.${key2}`}
                setExpanded={setExpandedWrap}
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

interface ColorSelectorWrapProps {
  key1: keyof typeof BasicKeys
  key2: (typeof BasicKeys)[keyof typeof BasicKeys][number]
  onChange: (
    color: string,
    key1: keyof typeof BasicKeys,
    key2: (typeof BasicKeys)[keyof typeof BasicKeys][number]
  ) => void
  value: string
  isExpanded: boolean
  setExpanded: (
    v: boolean,
    key1: keyof typeof BasicKeys,
    key2: (typeof BasicKeys)[keyof typeof BasicKeys][number]
  ) => void
}
const ColorSelectorWrap: React.FC<ColorSelectorWrapProps> = ({
  key1,
  key2,
  onChange,
  value,
  isExpanded,
  setExpanded,
}) => {
  const onChangeWrap = useCallback(
    (color: string) => {
      onChange(color, key1, key2)
    },
    [onChange, key1, key2]
  )

  const setExpandedWrap = useCallback(
    (v: boolean) => {
      setExpanded(v, key1, key2)
    },
    [setExpanded, key1, key2]
  )

  return (
    <ColorSelector
      value={value}
      onChange={onChangeWrap}
      isExpanded={isExpanded}
      setExpanded={setExpandedWrap}
    />
  )
}
