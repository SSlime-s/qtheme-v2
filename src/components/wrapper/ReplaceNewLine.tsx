import { IWrapper, WrapResolver } from '@/utils/wrapper'
import React from 'react'
import { PropsWithChildren } from 'react'

type Props = IWrapper

export const ReplaceNewLine: React.FC<PropsWithChildren<Props>> = ({
  children,
  Wrapper,
}) => {
  const parsed = children.split(/(\n)/).map((v, i) => {
    if (v === '\n') {
      return <br key={i} />
    }

    const wrapped = <WrapResolver Wrapper={Wrapper}>{v}</WrapResolver>
    return <React.Fragment key={i}>{wrapped}</React.Fragment>
  })

  return <>{parsed}</>
}
