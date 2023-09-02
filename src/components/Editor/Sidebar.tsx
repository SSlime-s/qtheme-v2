import styled from '@emotion/styled'

import { BlockStyle } from '@/components/layout/Sidebar'

interface Props {
  submit?: () => void
  shareUrl?: string
}

export const Sidebar: React.FC<Props> = ({ submit, shareUrl }) => {
  return (
    <>
      <SubmitButton onClick={submit}>Submit</SubmitButton>
      <ShareButton href={shareUrl} target='_blank' rel='noopener noreferrer'>
        Share
      </ShareButton>
    </>
  )
}

const SubmitButton = styled.button`
  ${BlockStyle}
  cursor: pointer;
`

const ShareButton = styled.a`
  ${BlockStyle}
  cursor: pointer;
`
