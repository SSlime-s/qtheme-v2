import styled from '@emotion/styled'
import { loadDefaultJapaneseParser } from 'budoux'
import React, { PropsWithChildren, useMemo } from 'react'

const parser = loadDefaultJapaneseParser()

type Props = Record<string, never>

export const BudouJa: React.FC<
  PropsWithChildren<Props> & {
    children: string
  }
> = ({ children }) => {
  const parsed = useMemo(() => {
    const result = parser.parse(children)
    return result.map((v, i) => {
      if (i == 0) {
        return <React.Fragment key={i}>{v}</React.Fragment>
      }
      return (
        <React.Fragment key={i}>
          <wbr />
          {v}
        </React.Fragment>
      )
    })
  }, [children])

  return <Wrap>{parsed}</Wrap>
}
const Wrap = styled.div`
  word-break: keep-all;
  overflow-wrap: break-word;
`
