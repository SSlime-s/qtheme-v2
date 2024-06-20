import { useCallback, useId, useMemo, useState } from 'react'

const useControlledTabListAbstract = <T extends string | number>(
  names: readonly [T, ...T[]],
  activeTab: T,
  onChange?: (name: T) => void
) => {
  const tabIdPrefix = useId()
  const panelIdPrefix = useId()

  const tabIds = useMemo(() => {
    return Object.fromEntries(
      names.map(name => [name, `${tabIdPrefix}-${name}`])
    )
  }, [names, tabIdPrefix])
  const panelIds = useMemo(() => {
    return Object.fromEntries(
      names.map(name => [name, `${panelIdPrefix}-${name}`])
    )
  }, [names, panelIdPrefix])

  const ariaTabListProps = useMemo(() => {
    return {
      role: 'tablist',
    } as const
  }, [])
  const ariaTabProps = useMemo(() => {
    return Object.fromEntries(
      names.map(name => [
        name,
        {
          role: 'tab',
          id: tabIds[name],
          'aria-controls': panelIds[name],
          'aria-selected': name === activeTab,
          tabIndex: name === activeTab ? 0 : -1,
        } as const,
      ])
    )
  }, [activeTab, names, panelIds, tabIds])
  const ariaPanelProps = useMemo(() => {
    return Object.fromEntries(
      names.map(name => [
        name,
        {
          role: 'tabpanel',
          id: panelIds[name],
          'aria-labelledby': tabIds[name],
          hidden: name !== activeTab,
        } as const,
      ])
    )
  }, [activeTab, names, panelIds, tabIds])

  const switchTab = useCallback(
    (name: T) => {
      onChange?.(name)
    },
    [onChange]
  )

  return {
    activeTab,
    switchTab,
    ariaTabListProps,
    ariaTabProps,
    ariaPanelProps,
  }
}
const useTabListAbstract = <T extends string | number>(
  names: readonly [T, ...T[]]
) => {
  const [activeTab, setActiveTab] = useState(names[0])
  return useControlledTabListAbstract(names, activeTab, setActiveTab)
}

export const useControlledNamedTabList = <T extends string>(
  names: readonly [T, ...T[]],
  activeTab: T,
  onChange?: (name: T) => void
) => {
  return useControlledTabListAbstract(names, activeTab, onChange)
}
export const useNamedTabList = <T extends string>(
  names: readonly [T, ...T[]]
) => {
  return useTabListAbstract(names)
}

export const useControlledIndexedTabList = (
  count: number,
  activeTab: number,
  onChange?: (index: number) => void
) => {
  return useControlledTabListAbstract(
    Array.from({ length: count }, (_, i) => i) as [number, ...number[]],
    activeTab,
    onChange
  )
}
export const useIndexedTabList = (count: number) => {
  return useTabListAbstract(
    Array.from({ length: count }, (_, i) => i) as [number, ...number[]]
  )
}
