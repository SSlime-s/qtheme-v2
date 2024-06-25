import { css } from "@emotion/react";

export const lineClamp = (lines: number) => css`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${lines};
  overflow: hidden;
  text-overflow: ellipsis;
`;
