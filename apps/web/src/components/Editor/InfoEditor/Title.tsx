import styled from '@emotion/styled'
import { lightTheme } from '@repo/theme/default'
import { useId } from 'react'
import { useFormContext } from 'react-hook-form'

import type { Form } from '@/components/Editor'

export const Title: React.FC = () => {
  const id = useId()
  const errorId = useId()
  const { register, formState } = useFormContext<Form>()

  return (
    <div>
      <Label htmlFor={id}>Title (required)</Label>
      <Input
        id={id}
        {...register('title', {
          required: 'タイトルは必須です',
        })}
        placeholder='Title'
        aria-invalid={formState.errors.title !== undefined ? true : false}
        aria-describedby={errorId}
      />
      <ErrorWrap aria-live='polite'>
        {formState.errors.title && (
          <Error id={errorId}>{formState.errors.title.message}</Error>
        )}
      </ErrorWrap>
    </div>
  )
}
const Label = styled.label`
  display: block;
  margin-bottom: 4px;
`
const Input = styled.input`
  display: block;
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

  &[aria-invalid='true']:not(:focus) {
    border-color: ${lightTheme.basic.accent.error};
  }
`
const ErrorWrap = styled.div`
  min-height: 1.25rem;
  margin-top: 4px;
`
const Error = styled.span`
  display: block;
  color: ${lightTheme.basic.accent.error};
  font-size: 0.75rem;
  line-height: 1.25rem;
`
