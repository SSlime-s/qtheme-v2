import { AutoResizeTextarea } from '@/components/AutoResizeTextarea'
import { lightTheme } from '@/lib/theme/default'
import styled from '@emotion/styled'
import { useId } from 'react'
import { useFormContext } from 'react-hook-form'
import { Form } from '../../index.page'

export const Description: React.FC = () => {
  const id = useId()
  const { register } = useFormContext<Form>()

  return (
    <div>
      <Label htmlFor={id}>Description</Label>
      <Input
        id={id}
        {...register('description')}
        placeholder='Description'
      />
    </div>
  )
}
const Label = styled.label`
  display: block;
  margin-bottom: 4px;
`
const Input = styled(AutoResizeTextarea)`
  width: 100%;
  border: 1px solid ${lightTheme.basic.ui.tertiary};
  border-radius: 4px;
  backdrop-filter: blur(4px);
  padding: 4px 8px;

  &:focus {
    border-color: ${lightTheme.basic.accent.primary};
  }
  &::placeholder {
    color: ${lightTheme.basic.ui.tertiary};
  }
`
