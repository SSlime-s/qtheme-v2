import { css } from "@emotion/react";

export const ColoredGlassmorphismStyle = (
	from: string,
	to: string = from,
	border: string = from,
) => css`
  border-radius: 20px;
  background: radial-gradient(ellipse at 0% 0%, ${from} 0%, ${to} 100%);
  border: 1px solid ${border};
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  overflow: hidden;
`;
export const GlassmorphismStyle = ColoredGlassmorphismStyle(
	"rgba(255, 255, 255, 0.5)",
	"rgba(255, 255, 255, 0.4)",
	"rgba(255, 255, 255, 0.5)",
);
