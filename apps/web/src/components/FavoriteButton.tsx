import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useCallback } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

import { lightTheme } from "@repo/theme/default";

import { ColoredGlassmorphismStyle } from "./Glassmorphism";

export interface Props {
	isFavorite: boolean;
	onClick: (after: boolean) => void;
	favoriteCount: number;
}

export const FavoriteButton: React.FC<Props> = ({
	isFavorite,
	onClick,
	favoriteCount,
}) => {
	const handleClick = useCallback(() => {
		onClick(!isFavorite);
	}, [isFavorite, onClick]);

	return (
		<Wrap onClick={handleClick} is-favorite={isFavorite}>
			{isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
			<span>{favoriteCount}</span>
		</Wrap>
	);
};

const Wrap = styled.button<{
	"is-favorite": boolean;
}>`
  /* background-image はアニメーションできないためグラデーションつけるのを諦める */
  ${ColoredGlassmorphismStyle("rgba(255, 255, 255, 0.5)")}
  background-image: none;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 8px;

  display: flex;
  align-items: center;
  padding: 4px 8px;
  gap: 4px;
  cursor: pointer;
  color: #333;

  transition: all 0.1s ease-in;
  transition-property: color, transform, background-color;

  &:hover {
    /* ${ColoredGlassmorphismStyle("rgba(236, 72, 153, 0.5)")}
    background-image: none;
    background-color: rgba(236, 72, 153, 0.3); */
    color: rgb(194, 24, 93);

    border-radius: 8px;

    transform: scale(1.05);
  }

  &:focus {
    outline: 1px solid ${lightTheme.basic.accent.primary};
    outline-offset: 1px;
  }

  ${({ "is-favorite": isFavorite }) =>
		isFavorite &&
		css`
      ${ColoredGlassmorphismStyle("rgba(236, 72, 153, 0.5)")}
      background-image: none;
      background-color: rgba(236, 72, 153, 0.3);
      color: rgb(194, 24, 93);
      border-radius: 8px;
    `}
`;
