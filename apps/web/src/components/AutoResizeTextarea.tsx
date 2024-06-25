import styled from "@emotion/styled";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";

import type { ComponentProps } from "react";

type Props = ComponentProps<"textarea">;
export const AutoResizeTextarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ onChange, ...props }, receiveRef) => {
    const ref = useRef<HTMLTextAreaElement>(null);
    const [height, setHeight] = useState<number | null>(null);
    const [dummyValue, setDummyValue] = useState(props.value ?? "");

    const onChangeHandler = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(e);
        setDummyValue(e.target.value);
      },
      [onChange],
    );
    // biome-ignore lint/correctness/useExhaustiveDependencies: dummyValue が変わるときに再計算する
    useEffect(() => {
      if (ref.current === null) {
        return;
      }
      const { scrollHeight } = ref.current;
      setHeight(scrollHeight);
      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        setHeight(entry.target.scrollHeight);
      });
      observer.observe(ref.current);
      return () => {
        observer.disconnect();
      };
    }, [dummyValue]);

    useEffect(() => {
      setDummyValue(props.value ?? "");
    }, [props.value]);

    return (
      <>
        <Textarea
          ref={receiveRef}
          height={height}
          onChange={onChangeHandler}
          {...props}
        />
        <Dummy
          ref={ref}
          value={dummyValue}
          className={props.className}
          rows={props.rows}
          aria-hidden="true"
          readOnly
        />
      </>
    );
  },
);
AutoResizeTextarea.displayName = "AutoResizeTextarea";

const Textarea = styled.textarea<{ height: number | null }>`
  height: ${({ height }) => (height === null ? "auto" : `${height}px`)};
  resize: none;
  overflow: hidden;
`;
const Dummy = styled.textarea`
  position: fixed !important;
  top: 0;
  left: 0;
  visibility: hidden;
  height: auto;
  overflow: hidden;
`;
