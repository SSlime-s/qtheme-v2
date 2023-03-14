import { AutoResizeTextarea } from '@/components/AutoResizeTextarea'
import { lightTheme } from '@/utils/theme/default'
import styled from '@emotion/styled'
import { useCallback } from 'react'
import { BsTextLeft } from 'react-icons/bs'

interface Props {
  onChange: (color: string) => void
  value: string
  placeholder?: string
}
export const ColorInput: React.FC<Props> = ({
  onChange,
  value,
  placeholder,
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value)
    },
    [onChange]
  )

  return (
    <Wrap className='mono'>
      <PrefixWrap>
        <Prefix>
          <BsTextLeft />
        </Prefix>
      </PrefixWrap>
      <InputWrap>
        <Input
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={1}
        />
      </InputWrap>
    </Wrap>
  )
}

const Wrap = styled.div`
  display: grid;
  border-radius: 4px;
  border: 1px solid #ced6db;
  grid-template-columns: max-content 1fr;
  grid-template-rows: max-content;
  backdrop-filter: blur(8px);
  width: 100%;
  gap: 8px;

  transition: all 0.2s ease-out;
  &:hover {
    border-color: #a8b0b5;
  }
  &:focus-within {
    border-color: ${lightTheme.basic.accent.focus};
  }
`
const PrefixWrap = styled.div`
  height: 100%;
  border-right: 1px solid #ced6db;
`
const Prefix = styled.div`
  display: grid;
  place-items: center;
  height: 32px;
  width: 32px;
  font-size: 24px;
  backdrop-filter: blur(4px);
  border-radius: 4px 0 0 4px;
`
const InputWrap = styled.div`
  width: 100%;
  height: max-content;
`
const Input = styled(AutoResizeTextarea)`
  width: 100%;
  line-height: 1.2;
  padding: calc(max(0px, (32px - 1.2rem) / 2));
`
