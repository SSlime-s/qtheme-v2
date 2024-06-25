import styled from "@emotion/styled";
import { useCallback, useEffect, useRef, useState } from "react";

import { useIsHoverable } from "@/utils/isMobile";
import { lightTheme } from "@repo/theme/default";

import { GlassmorphismStyle } from "./Glassmorphism";

interface Props {
	loadMore: () => Promise<void> | void;
	isReachingEnd: boolean;
}
export const InfiniteLoad: React.FC<Props> = ({ loadMore, isReachingEnd }) => {
	const isHoverable = useIsHoverable();

	const [isLoading, setIsLoading] = useState(false);
	const checkedLoadMore = useCallback(async () => {
		if (isLoading) {
			return;
		}
		if (isReachingEnd ?? true) {
			return;
		}
		setIsLoading(true);
		await loadMore();
		setIsLoading(false);
	}, [isLoading, isReachingEnd, loadMore]);

	const bottomRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (isHoverable) {
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					void checkedLoadMore();
				}
			},
			{
				threshold: 0.5,
			},
		);
		if (bottomRef.current) {
			observer.observe(bottomRef.current);
		}
		return () => {
			observer.disconnect();
		};
	}, [checkedLoadMore, isHoverable]);

	return (
		<>
			{isReachingEnd === false && isHoverable && (
				<LoadMoreButton aria-busy={isLoading} onClick={checkedLoadMore}>
					<span>もっと見る</span>
				</LoadMoreButton>
			)}
			<Stopper ref={bottomRef} />
		</>
	);
};

const LoadMoreButton = styled.button`
  ${GlassmorphismStyle}
  border-radius: 9999px;
  cursor: pointer;

  padding: 8px 16px;
  margin: 32px 0;

  &:hover {
    transform: scale(1.05);
  }
  &:focus {
    outline: 1px solid ${lightTheme.basic.accent.primary};
    outline-offset: -2px;
  }
`;
const Stopper = styled.div`
  width: 100%;
`;
