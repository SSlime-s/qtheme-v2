import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

export const useModal = <
  TitleElement extends HTMLElement = HTMLHeadingElement,
  TriggerElement extends HTMLElement = HTMLButtonElement,
>(
  id: string,
  /** 閉じる前に呼び出される関数 false を返すと閉じない */
  beforeClose?: () => Promise<boolean> | boolean,
) => {
  const titleRef = useRef<TitleElement>(null);
  const triggerRef = useRef<TriggerElement>(null);

  const titleId = useId();

  // beforeClose を呼び出し、閉じていい場合は true を返す
  const checkClose = useCallback(async (): Promise<boolean> => {
    if (beforeClose === undefined) {
      return true;
    }

    const success = await beforeClose();
    return success;
  }, [beforeClose]);

  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => {
    setIsOpen(true);
    titleRef.current?.focus();

    history.pushState(
      {
        ...history.state,
        modalId: id,
      },
      "",
    );
  }, [id]);
  const close = useCallback(async () => {
    if (!(await checkClose())) {
      return;
    }
    history.back();

    await new Promise((resolve) => {
      window.addEventListener("popstate", resolve, { once: true });
    });

    setIsOpen(false);
    triggerRef.current?.focus();
  }, [checkClose]);
  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      if (prev) {
        triggerRef.current?.focus();
      } else {
        titleRef.current?.focus();
      }

      return !prev;
    });
  }, []);

  const modalProps = useMemo(() => {
    return {
      "aria-modal": isOpen,
      "aria-labelledby": titleId,
      role: "dialog",
    };
  }, [isOpen, titleId]);

  const titleProps = useMemo(() => {
    return {
      id: titleId,
    };
  }, [titleId]);

  useEffect(() => {
    const handlePopState = async (e: PopStateEvent) => {
      if (e.state?.modalId === id) {
        setIsOpen(true);
        return;
      }

      if (!(await checkClose())) {
        open();
        return;
      }
      setIsOpen(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [checkClose, id, open]);

  return {
    isOpen,
    open,
    close,
    toggle,
    modalProps,
    titleProps,
    titleRef,
    triggerRef,
  };
};
