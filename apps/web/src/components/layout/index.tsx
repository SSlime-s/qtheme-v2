import styled from "@emotion/styled";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

import { ToastContainer } from "@/components/Toast";
import { isMobile, useIsMobile } from "@/utils/isMobile";
import { usePageLoading } from "@/utils/usePageLoading";

import { LoadingBar } from "../LoadingBar";

import { Header } from "./Header";
import {
	convertChannelPath,
	extendChannelPath,
} from "./Header/convertChannelPath";
import { Navbar } from "./Navbar";
import { DefaultSidebarContent, Sidebar } from "./Sidebar";

import type { PropsWithChildren } from "react";
import type { ChannelPath } from "./Header/convertChannelPath";

interface Props {
	userId?: string;
	noSidebar?: boolean;
}

export const Layout: React.FC<PropsWithChildren<Props>> = ({
	userId: _u,
	children,
	noSidebar = false,
}) => {
	const isMobile = useIsMobile();
	const router = useRouter();
	const isPageLoading = usePageLoading();

	// NOTE: rewrite した際に hydration error が起きるため、useEffect で初期化・更新する
	const [nowChannelPath, setNowChannelPath] = useState<ChannelPath[]>([]);
	useEffect(() => {
		function calc() {
			const path = router.asPath
				.split("/")
				.filter((p) => p !== "")
				.map((p) => {
					const split = p.split("?");
					return split[0];
				})
				.map((p) => {
					const split = p.split("#");
					return split[0];
				});

			// theme は下に uuid が来るため、uuid まで込みで theme とする
			if (path[0] === "theme") {
				if (path[1] === undefined) {
					return [
						{
							name: "theme",
							href: "/theme",
						},
					];
				}
				const root = {
					name: "theme",
					href: `/theme/${path[1]}`,
				};
				return extendChannelPath([root], path.slice(2));
			}

			return convertChannelPath(path);
		}

		setNowChannelPath(calc());
	}, [router]);

	const mainRef = useRef<HTMLDivElement>(null);
	const scrollToSelf = useCallback(() => {
		if (!isMobile) {
			return;
		}
		mainRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
	}, [isMobile]);

	useEffect(() => {
		if (!isMobile) {
			return;
		}
		mainRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
	}, [isMobile]);
	// biome-ignore lint/correctness/useExhaustiveDependencies: router.asPath が変わるときにもスクロールする
	useEffect(() => {
		if (!isMobile) {
			return;
		}
		scrollToSelf();
	}, [isMobile, router.asPath, scrollToSelf]);

	const navBarRef = useRef<HTMLDivElement>(null);
	const openNavBar = useCallback(() => {
		if (!isMobile) {
			return;
		}
		navBarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
	}, [isMobile]);

	return (
		<Container>
			<Navbar scrollRef={navBarRef} />
			<Header channelPath={nowChannelPath} openNavBar={openNavBar} />
			<DummyMain ref={mainRef} />
			<Main onClickCapture={scrollToSelf}>
				{isPageLoading && <Loading />}
				{children}
			</Main>
			<Sidebar id="app-sidebar">
				{!noSidebar && <DefaultSidebarContent />}
			</Sidebar>
			<ToastContainer />
		</Container>
	);
};
const SidebarPortalRaw: React.FC<PropsWithChildren> = ({ children }) => {
	return ReactDOM.createPortal(
		children,
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		document.getElementById("app-sidebar")!,
	);
};
export const SidebarPortal = dynamic(() => Promise.resolve(SidebarPortalRaw), {
	ssr: false,
});

const Container = styled.div`
  display: grid;
  grid-template-areas: 'nav header header' 'nav main side';
  grid-template-columns: 340px 1fr 256px;
  grid-template-rows: 80px 1fr;
  width: 100%;
  height: 100%;

  position: relative;
  overflow: hidden;

  ${isMobile} {
    grid-template-areas: 'nav header side' 'nav main side';
    grid-template-columns: 320px 100vw 320px;
    grid-template-rows: 80px 1fr;
    width: calc(100vw + 640px);
    overflow: visible;
  }

  background: ${({ theme }) => theme.theme.basic.background.primary.default};

  & * {
    scrollbar-color: ${({ theme }) =>
			`${theme.theme.browser.scrollbarThumb} ${theme.theme.browser.scrollbarTrack}`};
    /* transition: scrollbar-color 0.3s; */
    &:hover,
    &:active {
      scrollbar-color: ${({ theme }) =>
				`${theme.theme.browser.scrollbarThumbHover} ${theme.theme.browser.scrollbarTrack}`};
    }

    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    scrollbar-width: thin;

    &::-webkit-scrollbar-track {
      background: ${({ theme }) => theme.theme.browser.scrollbarTrack};
      &:hover {
        background: ${({ theme }) => theme.theme.browser.scrollbarTrack};
      }
    }

    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.theme.browser.scrollbarThumb};
      transition: background 0.3s;
      border-radius: 3px;
      &:hover {
        background: ${({ theme }) => theme.theme.browser.scrollbarThumbHover};
      }
    }
    &::-webkit-scrollbar-corner {
      visibility: hidden;
      display: none;
    }
  }

  & *::selection {
    color: ${({ theme }) => theme.theme.browser.selectionText};
    background: ${({ theme }) => theme.theme.browser.selectionBackground};
  }
  & * {
    caret-color: ${({ theme }) => theme.theme.browser.caret};
  }
`;

const Main = styled.main`
  grid-area: main;
  /* HACK: overflow: overlay が無効なブラウザ用の fallback */
  overflow: auto;
  overflow: overlay;
  contain: strict;
  height: 100%;
  background: ${({ theme }) => theme.theme.specific.mainViewBackground};
  position: relative;

  ${isMobile} {
    position: sticky;
    left: 0;
    z-index: 20;
  }
`;
const Loading = styled(LoadingBar)`
  position: absolute;
  top: 0;
  left: 0;
`;
const DummyMain = styled.div`
  grid-area: main;
  display: none;

  ${isMobile} {
    display: block;
    pointer-events: none;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
`;
