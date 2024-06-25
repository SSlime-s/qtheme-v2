import { css } from "@emotion/react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

export const useControlledAccordion = <E extends HTMLElement = HTMLDivElement>(
  isOpen: boolean,
  onToggle?: (isOpen: boolean) => void,
  contentMargin = 0,
) => {
  const contentId = useId();
  const ref = useRef<E>(null);

  const [contentHeight, setContentHeight] = useState<number>();

  const toggle = useCallback(() => {
    onToggle?.(!isOpen);
  }, [isOpen, onToggle]);
  const open = useCallback(() => {
    onToggle?.(true);
  }, [onToggle]);
  const close = useCallback(() => {
    onToggle?.(false);
  }, [onToggle]);

  useEffect(() => {
    if (ref.current === null) {
      return;
    }

    const content = ref.current;
    const setHeight = () => {
      if (content.scrollHeight === 0 && isOpen) {
        return;
      }
      setContentHeight(content.scrollHeight + contentMargin);
    };

    setHeight();
    const observer = new ResizeObserver(setHeight);
    observer.observe(content);

    return () => {
      observer.disconnect();
    };
  }, [contentMargin, isOpen]);

  const ariaToggle = useMemo(() => {
    return {
      "aria-controls": contentId,
      "aria-expanded": isOpen,
    };
  }, [contentId, isOpen]);
  const ariaContent = useMemo(() => {
    return {
      id: contentId,
      // FIXME: ページ内検索で引っかからないように hidden もつけるべき
      "aria-hidden": !isOpen,
    };
  }, [contentId, isOpen]);

  return {
    isOpen,
    toggle,
    open,
    close,
    contentRef: ref,
    contentHeight,
    ariaToggle,
    ariaContent,
  };
};

export const useAccordion = <E extends HTMLElement = HTMLDivElement>(
  contentMargin = 0,
) => {
  const [isOpen, setIsOpen] = useState(false);
  return useControlledAccordion<E>(isOpen, setIsOpen, contentMargin);
};

export const useHiddenTransition = (isOpen: boolean) => {
  const [isHidden, setIsHidden] = useState(!isOpen);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsHidden(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const { current } = ref;
    if (current === null) {
      return;
    }
    const onTransitionEnd = () => {
      if (!isOpen) {
        setIsHidden(true);
      }
    };
    current.addEventListener("transitionend", onTransitionEnd);
    return () => {
      current.removeEventListener("transitionend", onTransitionEnd);
    };
  }, [isOpen]);

  const style = useMemo(() => {
    if (isHidden) {
      return css`
        display: none;
      `;
    }
    return undefined;
  }, [isHidden]);

  return {
    ref,
    isHidden,
    style,
  };
};
