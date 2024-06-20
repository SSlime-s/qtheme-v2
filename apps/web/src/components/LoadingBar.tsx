import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

const LoadingKeyframes = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`
const FadeTopKeyframes = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }
  100% {
    opacity: 0.5;
    transform: translateY(0);
  }
`
export const LoadingBar = styled.div`
  background: linear-gradient(
      0,
      ${({ theme }) => theme.theme.basic.ui.primary.default},
      ${({ theme }) => theme.theme.basic.ui.secondary.default}
    ),
    linear-gradient(45deg, #ccc, #444, #ccc);

  background-blend-mode: color;
  background-size: 400% 100%;
  animation:
    ${LoadingKeyframes} 3s ease infinite,
    ${FadeTopKeyframes} 0.5s ease;
  opacity: 0.5;
  pointer-events: none;

  height: 12px;
  width: 100%;
`

const SkeletonKeyframes = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`
export const Skeleton = styled.div<{
  width?: string
  height?: string
  borderRadius?: string
}>`
  position: relative;
  width: ${({ width }) => width ?? '100%'};
  height: ${({ height }) => height ?? '100%'};
  ${({ borderRadius }) =>
    borderRadius !== undefined &&
    css`
      border-radius: ${borderRadius};
    `}
  background: ${({ theme }) => theme.theme.basic.ui.secondary.default};
  overflow: hidden;
  opacity: 0.5;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ theme }) => theme.theme.basic.ui.primary.default},
      transparent
    );
    animation: ${SkeletonKeyframes} 1.2s ease infinite;
  }
`
