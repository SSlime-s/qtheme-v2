import React from 'react'
import { PropsWithChildren } from 'react'

interface Props {
  children: string
  Wrapper?: React.FC<PropsWithChildren<unknown>>
}

export const ReplaceNewLine: React.FC<PropsWithChildren<Props>> = ({
  children,
  Wrapper,
}) => {
  const parsed = children.split(/(\n)/).map((v, i) => {
    if (v === '\n') {
      return <br key={i} />
    }

    const wrapped = Wrapper !== undefined ? <Wrapper>{v}</Wrapper> : v
    return <React.Fragment key={i}>{wrapped}</React.Fragment>
  })

  return <>{parsed}</>
}
