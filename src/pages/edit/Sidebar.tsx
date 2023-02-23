import { BlockStyle } from '@/components/layout/Sidebar'
import styled from '@emotion/styled'

interface Props {
  submit?: () => void
}

export const Sidebar: React.FC<Props> = ({ submit }) => {
  return (
    <>
      <SubmitButton onClick={submit}>Submit</SubmitButton>
    </>
  )
}

const SubmitButton = styled.button`
  ${BlockStyle}
  cursor: pointer;
`
