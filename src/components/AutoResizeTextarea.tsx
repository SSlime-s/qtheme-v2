import styled from '@emotion/styled'
import {
  ComponentProps,
  useRef,
  useState,
  useCallback,
  useEffect,
  forwardRef,
} from 'react'

type Props = ComponentProps<'textarea'>
export const AutoResizeTextarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ onChange, ...props }, receiveRef) => {
    const ref = useRef<HTMLTextAreaElement>(null)
    const [height, setHeight] = useState<number | null>(null)
    const [dummyValue, setDummyValue] = useState(props.value ?? '')

    const onChangeHandler = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(e)
        setDummyValue(e.target.value)
      },
      [onChange]
    )
    useEffect(() => {
      if (ref.current === null) {
        return
      }
      const { scrollHeight } = ref.current
      setHeight(scrollHeight)
    }, [dummyValue])
    useEffect(() => {
      setDummyValue(props.value ?? '')
    }, [props.value])

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
          aria-hidden='true'
          readOnly
        />
      </>
    )
  }
)
AutoResizeTextarea.displayName = 'AutoResizeTextarea'

const Textarea = styled.textarea<{ height: number | null }>`
  height: ${({ height }) => (height === null ? 'auto' : `${height}px`)};
  resize: none;
  overflow: hidden;
`
const Dummy = styled.textarea`
  position: fixed !important;
  top: 0;
  left: 0;
  visibility: hidden;
  height: auto;
  overflow: hidden;
`
