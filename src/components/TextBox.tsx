import { lineClamp } from '@/styles/lineClamp'
import styled from '@emotion/styled'
import { useEffect, useRef } from 'react'

export interface Props {
  before?: React.ReactNode
  after?: React.ReactNode

  readOnly?: boolean
}
export const TextBox: React.FC<
  Props & React.HTMLAttributes<HTMLTextAreaElement>
> = ({ readOnly, ...props }) => {
  if (readOnly === true) {
    return <ReadOnlyTextBox {...props} />
  }

  const { before, after, ...restProps } = props

  return (
    <Wrap>
      {before != null && <Before>{before}</Before>}
      <Input {...restProps} />
      {after != null && <After>{after}</After>}
    </Wrap>
  )
}

const ReadOnlyTextBox: React.FC<
  Props & React.HTMLAttributes<HTMLTextAreaElement>
> = ({ before, after, className, ...props }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textAreaRef.current === null) return
    const textArea = textAreaRef.current
    const selectAll = () => {
      textArea.focus()
      textArea.select()
    }
    textArea.addEventListener('focus', selectAll)

    return () => {
      textArea.removeEventListener('focus', selectAll)
    }
  }, [])

  return (
    <Wrap className={className}>
      {before != null && <Before>{before}</Before>}
      <Input ref={textAreaRef} {...props} readOnly rows={1} />
      {after != null && (
        <After>
          <AfterContent>{after}</AfterContent>
        </After>
      )}
    </Wrap>
  )
}

const Wrap = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  background: ${({ theme }) => theme.theme.basic.background.secondary.default};
  border-radius: 4px;
  overflow: hidden;
  padding: 8px 16px;
  border: solid 2px transparent;
  &:focus-within {
    border-color: ${({ theme }) => theme.theme.basic.accent.focus.default};
  }
`
const Before = styled.div`
  height: 40px;
  align-self: end;
`
const Input = styled.textarea`
  grid-column: 2;
  border: none;
  background: ${({ theme }) => theme.theme.basic.background.primary.default};
  color: ${({ theme }) => theme.theme.basic.text.primary.default};
  padding: 8px 16px;
  max-height: 160px;
  &[readonly] {
    color: ${({ theme }) => theme.theme.basic.ui.secondary.inactive};
    cursor: default;
  }
  border-radius: 8px 0 0 8px;
  &:last-child {
    border-radius: 8px;
  }
  &::placeholder {
    color: ${({ theme }) => theme.theme.basic.ui.secondary.inactive};
  }
  &:placeholder-shown {
    ${lineClamp(1)}
    height: unset;
  }
  height: 40px;
  overflow: hidden;
  resize: none;
`
const After = styled.div`
  grid-column: 3;
  background: ${({ theme }) => theme.theme.basic.background.primary.default};
  border-radius: 0 8px 8px 0;
  display: grid;
  height: 100%;
`
const AfterContent = styled.div`
  height: 40px;
  align-self: end;
`
