import { css } from '@emotion/react'
import styled from '@emotion/styled'
import React, { PropsWithChildren, useMemo } from 'react'
import { ColoredGlassmorphismStyle } from './Glassmorphism'

type Variant = 'light' | 'dark' | 'other' | 'private' | 'public' | 'draft'

type AnchorProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & {
  as: 'a'
}

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  as: 'button'
}

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  as: 'div'
}

type Props = (AnchorProps | ButtonProps | DivProps) & {
  variant: Variant
}

interface Color {
  from: string
  to: string
  text: string
  border?: string
}
const colorMap: Record<Variant, Color> = {
  light: {
    from: 'rgba(255, 255, 255, 0.4)',
    to: 'rgba(255, 255, 255, 0.2)',
    text: '#333',
  },
  dark: {
    from: 'rgba(0, 60, 60, 0.4)',
    to: 'rgba(0, 60, 60, 0.2)',
    text: '#fff',
  },
  other: {
    from: 'rgba(255, 255, 255, 0.4)',
    to: 'rgba(255, 255, 255, 0.2)',
    text: '#333',
  },
  public: {
    from: 'rgba(40, 240, 228, 0.4)',
    to: 'rgba(40, 240, 228, 0.2)',
    text: '#333',
  },
  private: {
    from: 'rgba(255, 255, 255, 0.4)',
    to: 'rgba(255, 255, 255, 0.2)',
    text: '#333',
  },
  draft: {
    from: 'rgba(242, 100, 81, 0.4)',
    to: 'rgba(242, 100, 81, 0.2)',
    text: '#333',
  },
}

export const Tag: React.FC<PropsWithChildren<Props>> = ({
  as,
  children,
  variant,
  ...props
}) => {
  const baseStyle = useMemo(() => {
    return css`
      display: inline-block;
      place-items: center;
      ${ColoredGlassmorphismStyle(
        colorMap[variant].from,
        colorMap[variant].to,
        colorMap[variant].border
      )}
      color: ${colorMap[variant].text};
      text-transform: uppercase;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
    `
  }, [variant])
  const Tag = useMemo(() => {
    return styled(as)`
      ${baseStyle}
      padding: 4px 8px;
      border-radius: 8px;

      transition: all 0.1s ease-in-out;

      ${as !== 'div'
        ? css`
            cursor: pointer;
            &:hover {
              transform: scale(1.05);
            }
          `
        : ''}
    `
  }, [as, baseStyle])

  return <Tag {...props}>{children}</Tag>
}
