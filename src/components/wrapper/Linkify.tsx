import { IWrapper, WrapResolver } from '@/lib/wrapper'
import React from 'react'
import { PropsWithChildren } from 'react'
import LinkifyIt from 'linkify-it'

type Props = IWrapper

export const Linkify: React.FC<PropsWithChildren<Props>> = ({
  children,
  Wrapper,
}) => {
  const linkify = LinkifyIt()
  const matches = linkify.match(children)

  if (matches === null) {
    return <>{children}</>
  }

  let rest = children
  let offset = 0
  const parsed = matches.map((v, i) => {
    const before = rest.slice(0, v.index - offset)
    const after = rest.slice(v.lastIndex - offset)
    rest = after
    offset += before.length + v.raw.length

    const wrappedBefore = (
      <WrapResolver Wrapper={Wrapper}>{before}</WrapResolver>
    )
    const wrappedLink = (
      <a href={v.url} target='_blank' rel='noopener noreferrer'>
        <WrapResolver Wrapper={Wrapper}>{v.text}</WrapResolver>
      </a>
    )

    return (
      <React.Fragment key={i}>
        {wrappedBefore}
        {wrappedLink}
      </React.Fragment>
    )
  })

  return (
    <>
      {parsed}
      {rest !== '' && <WrapResolver Wrapper={Wrapper}>{rest}</WrapResolver>}
    </>
  )
}
