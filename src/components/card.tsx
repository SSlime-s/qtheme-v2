import { css } from '@emotion/react'

export const GlassmorphismStyle = css`
  border-radius: 20px;
  background: radial-gradient(
    0% 0%,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  overflow: hidden;
`
