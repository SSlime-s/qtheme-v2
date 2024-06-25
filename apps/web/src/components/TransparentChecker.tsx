import { css } from "@emotion/react";

export const TransparentCheckerStyle = css`
  background: rgb(204, 204, 204);
  background-image: linear-gradient(
      45deg,
      rgb(255, 255, 255) 25%,
      transparent 0
    ),
    linear-gradient(45deg, transparent 75%, rgb(255, 255, 255) 0),
    linear-gradient(45deg, rgb(255, 255, 255) 25%, transparent 0),
    linear-gradient(45deg, transparent 75%, rgb(255, 255, 255) 0);
  background-size: 16px 16px;
  background-position:
    0 0,
    8px 8px,
    8px 8px,
    16px 16px;
`;
