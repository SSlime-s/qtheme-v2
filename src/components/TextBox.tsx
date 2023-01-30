import styled from '@emotion/styled'

export interface Props {
  before?: React.ReactNode
  after?: React.ReactNode
}
export const TextBox: React.FC<
  Props & React.HTMLAttributes<HTMLTextAreaElement>
> = ({ before, after, ...props }) => {
  return (
    <Wrap>
      {before != null && <Before>{before}</Before>}
      <Input {...props} />
      {after != null && <After>{after}</After>}
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
    cursor: wait;
  }
  border-radius: 8px 0 0 8px;
  &:last-child {
    border-radius: 8px;
  }
  &::placeholder {
    color: ${({ theme }) => theme.theme.basic.ui.secondary.inactive};
  }
  &:placeholder-shown {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    height: 40px;
  }
  resize: none;
`
const After = styled.div`
  grid-column: 3;
  background: ${({ theme }) => theme.theme.basic.background.primary.default};
  border-radius: 0 8px 8px 0;
  height: 40px;
  align-self: end;
`
