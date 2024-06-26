import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { RxReset } from "react-icons/rx";

import { isMobile, useIsMobile } from "@/utils/isMobile";
import { useCurrentTheme } from "@/utils/theme/hooks";
import { WrapResolver } from "@/utils/wrapper";
import { BreakStyle, BudouJa } from "@/utils/wrapper/BudouX";
import { Linkify } from "@/utils/wrapper/Linkify";
import { ReplaceNewLine } from "@/utils/wrapper/ReplaceNewLine";

import type { ResolvedTheme } from "@repo/theme/resolve";
import type { PropsWithChildren } from "react";

interface Props {
	id?: string;
}
export const Sidebar: React.FC<PropsWithChildren<Props>> = ({
	children,
	id,
}) => {
	const isMobile = useIsMobile();
	const ref = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	useEffect(() => {
		if (ref.current === null) return;
		if (!isMobile) return;

		setIsOpen(false);
		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (entry.isIntersecting) {
					if (entry.intersectionRatio >= 0.6) {
						setIsOpen(true);
					} else {
						setIsOpen(false);
					}
				}
			},
			{
				root: null,
				threshold: [0, 0.4, 0.6],
			},
		);
		observer.observe(ref.current);
		return () => {
			observer.disconnect();
		};
	}, [isMobile]);

	const scrollToSelf = useCallback(() => {
		if (!isMobile) {
			return;
		}
		ref.current?.scrollIntoView({ behavior: "smooth", block: "end" });
	}, [isMobile]);

	return (
		<>
			<Cover hidden={!isOpen} />
			<Wrap ref={ref} id={id}>
				<OpenButton onClick={scrollToSelf} hidden={!isMobile || isOpen}>
					<MdKeyboardDoubleArrowLeft role="img" aria-label="open" />
				</OpenButton>
				{children}
			</Wrap>
		</>
	);
};
export const DefaultSidebarContent: React.FC = () => {
	const {
		currentThemeInfo,
		mutate: { changeToDefaultTheme },
	} = useCurrentTheme();
	const [isConfirm, setIsConfirm] = useState(false);
	const [confirmTimeoutId, setConfirmTimeoutId] = useState<NodeJS.Timeout>();
	const confirmedToDefaultTheme = useCallback(() => {
		if (isConfirm) {
			changeToDefaultTheme();
			setIsConfirm(false);
			if (confirmTimeoutId) {
				clearTimeout(confirmTimeoutId);
				setConfirmTimeoutId(undefined);
			}
			return;
		}

		setIsConfirm(true);
		const timeoutId = setTimeout(() => {
			setIsConfirm(false);
			setConfirmTimeoutId(undefined);
		}, 2000);
		setConfirmTimeoutId(timeoutId);
	}, [changeToDefaultTheme, confirmTimeoutId, isConfirm]);

	return (
		<>
			{currentThemeInfo === null ? (
				<Block>
					<Title>現在のテーマ</Title>
					<p>テーマが選択されていません</p>
				</Block>
			) : (
				<LinkBlock href={`/theme/${currentThemeInfo?.id}`}>
					<Title>現在のテーマ</Title>
					<BreakP>
						<BudouJa>{currentThemeInfo.title}</BudouJa>
					</BreakP>
				</LinkBlock>
			)}
			{currentThemeInfo !== null && (
				<>
					<Block>
						<Title>詳細</Title>
						<BreakP>
							<WrapResolver Wrapper={[Linkify, BudouJa, ReplaceNewLine]}>
								{currentThemeInfo.description}
							</WrapResolver>
						</BreakP>
					</Block>

					<ResetButton onClick={confirmedToDefaultTheme}>
						{isConfirm ? "もう一度クリックで確定" : "デフォルトテーマに戻す"}
						<RxReset />
					</ResetButton>
				</>
			)}
		</>
	);
};

const Wrap = styled.aside`
  grid-area: side;
  position: relative;
  background: ${({ theme }) => theme.theme.specific.sideBarBackground};
  padding: 32px;

  ${isMobile} {
    position: relative;
    z-index: 30;
    scroll-snap-align: end;
    scroll-snap-stop: always;
  }
`;
const OpenButton = styled.button`
  position: absolute;
  top: 80px;
  left: 0;
  padding: 16px;
  transform: translateX(-100%);
  color: ${({ theme }) => theme.theme.basic.ui.primary.default};
  font-size: 28px;

  & > svg {
    transition: transform 0.1s;
  }
  &:hover > svg {
    transform: scale(1.1);
  }

  &[hidden] {
    display: none;
  }
`;
export const BlockStyle = ({
	theme,
}: {
	theme: { theme: ResolvedTheme };
}) => css`
  background: ${theme.theme.basic.background.primary.default};
  color: ${theme.theme.basic.ui.secondary.default};
  width: 100%;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  display: block;
`;
export const Block = styled.div`
  ${BlockStyle}
`;
export const LinkBlock = styled(Link)`
  ${BlockStyle}
`;
export const BreakP = styled.p`
  ${BreakStyle}

  & > a {
    color: ${({ theme }) => theme.theme.markdown.linkText};

    &:hover {
      text-decoration: underline;
    }
  }
`;
export const ResetButton = styled.button`
  ${BlockStyle}

  cursor: pointer;
  display: grid;
  grid-template-columns: 1fr max-content;
  align-items: start;
  font-weight: bold;
  gap: 4px;

  & > svg {
    font-size: 1.5rem;
    margin-top: 2px;
  }
`;
const Title = styled.p`
  font-weight: bold;
  margin-bottom: 8px;
`;

const Cover = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: rgba(25, 26, 29, 0.5);
  opacity: 0;
  height: 100vh;
  width: 100vw;
  transition: opacity 0.2s ease-in-out;
  z-index: 29;
  display: none;

  ${isMobile} {
    display: block;
    opacity: 1;

    &[hidden] {
      opacity: 0;
    }
  }
`;
