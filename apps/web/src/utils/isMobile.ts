import { atom, useAtomValue } from "jotai";

const mobileBreakpoint = 992;

const isMobileAtom = atom(false);
isMobileAtom.onMount = (setAtom) => {
	const matchQuery = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`);
	const handler = (e: MediaQueryListEvent) => {
		setAtom(e.matches);
	};
	matchQuery.addEventListener("change", handler);
	setAtom(matchQuery.matches);
	return () => {
		matchQuery.removeEventListener("change", handler);
	};
};
export const useIsMobile = () => {
	return useAtomValue(isMobileAtom);
};

export const isMobile = `@media (max-width: ${mobileBreakpoint}px)` as const;

const isHoverableAtom = atom(false);
isHoverableAtom.onMount = (setAtom) => {
	const matchQuery = window.matchMedia("(hover: hover)");
	const handler = (e: MediaQueryListEvent) => {
		setAtom(e.matches);
	};
	matchQuery.addEventListener("change", handler);
	setAtom(matchQuery.matches);
	return () => {
		matchQuery.removeEventListener("change", handler);
	};
};
export const useIsHoverable = () => {
	return useAtomValue(isHoverableAtom);
};

const mobileAgent =
	/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
export const isMobileAgent = (userAgent: string): boolean => {
	return mobileAgent.test(userAgent);
};
