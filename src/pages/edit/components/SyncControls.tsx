import { ColoredGlassmorphismStyle } from '@/components/Glassmorphism'
import { useCurrentTheme } from '@/lib/theme/hooks'
import styled from '@emotion/styled'
import { atom, useAtom } from 'jotai'
import { useState, useEffect, useCallback } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { Form } from '../index.page'

const AlwaysSyncAtom = atom<boolean>(false)
export const SyncControls: React.FC = () => {
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
    <Wrap>
      <SyncButton onClick={sync} disabled={isSynced} aria-pressed={isSynced}>
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
    </Wrap>
  )
}
const Wrap = styled.div`
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

  &:hover {
    box-shadow: 0 0 4px rgba(0, 91, 172, 0.3);
  }
  &:focus {
    box-shadow: 0 0 0 2px rgba(0, 91, 172, 0.3);
  }
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

  &:hover:after {
    box-shadow: 0 0 4px rgba(0, 91, 172, 0.3);
  }
  &:focus:after {
    box-shadow: 0 0 0 2px rgba(0, 91, 172, 0.3);
  }
`
