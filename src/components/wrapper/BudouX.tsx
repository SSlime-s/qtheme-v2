import { IWrapper, WrapResolver } from '@/lib/wrapper'
import styled from '@emotion/styled'
import { loadDefaultJapaneseParser } from 'budoux'
import React, { PropsWithChildren, useMemo } from 'react'

const parser = loadDefaultJapaneseParser()

type Props = IWrapper

export const BudouJa: React.FC<PropsWithChildren<Props>> = ({
  children,
  Wrapper,
}) => {
  const parsed = useMemo(() => {
    const result = parser.parse(children)
    return result.map((v, i) => {
      const wrapped = <WrapResolver Wrapper={Wrapper}>{v}</WrapResolver>

      if (i == 0) {
        return <React.Fragment key={i}>{wrapped}</React.Fragment>
      }
      return (
        <React.Fragment key={i}>
          <wbr />
          {wrapped}
        </React.Fragment>
      )
    })
  }, [Wrapper, children])

  return <Wrap>{parsed}</Wrap>
}
const Wrap = styled.div`
  word-break: keep-all;
  overflow-wrap: break-word;
`