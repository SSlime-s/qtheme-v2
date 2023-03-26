import { IWrapper, WrapResolver } from '@/utils/wrapper'
import React, { ComponentProps, useMemo } from 'react'
import { PropsWithChildren } from 'react'
import NativeLinkify from 'linkify-react'

type Props = IWrapper

export const Linkify: React.FC<PropsWithChildren<Props>> = ({
  children,
  Wrapper,
}) => {
  return (
    <NativeLinkify
      options={{
        render: useMemo(() => renderLink(Wrapper), [Wrapper]),
      }}
    >
      {children}
    </NativeLinkify>
  )
}

const WrappedLink: React.FC<
  ComponentProps<'a'> & Omit<IWrapper, 'children'>
> = ({ children, Wrapper, ...props }) => {
  if (typeof children !== 'string') {
    return <>{children}</>
  }

  return (
    <a target='_blank' rel='noopener noreferrer' {...props}>
      <WrapResolver Wrapper={Wrapper}>{children}</WrapResolver>
    </a>
  )
}
const renderLink =
  (Wrapper: IWrapper['Wrapper']) =>
  // eslint-disable-next-line react/display-name
  ({
    attributes,
    content,
  }: {
    attributes: ComponentProps<'a'>
    content: string
  }) => {
    return (
      <WrappedLink Wrapper={Wrapper} {...attributes}>
        {content}
      </WrappedLink>
    )
  }
