import { lightTheme } from "@/utils/theme/default"
import styled from "@emotion/styled"
import { useId } from "react"
import { useFormContext } from "react-hook-form"
import { Form } from "../../index.page"

export const Title: React.FC = () => {
  const id = useId()
  const { register } = useFormContext<Form>()

  return (
    <div>
      <Label htmlFor={id}>Title</Label>
      <Input id={id} {...register('title')} placeholder='Title' />
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
`
