import styled from "@emotion/styled";
import { useCallback, useId } from "react";
import { BiSearch } from "react-icons/bi";

export const FilterBox: React.FC<{
	word: string;
	setWord: (word: string) => void;
	placeholder?: string;
}> = ({ word, setWord, placeholder }) => {
	const id = useId();

	const onSubmit = useCallback(
		() => (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
		},
		[],
	);

	const onChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setWord(e.target.value);
		},
		[setWord],
	);

	return (
		<Form onSubmit={onSubmit}>
			<InputWrap>
				<BiSearch />
				<Input
					type="search"
					id={id}
					placeholder={placeholder}
					value={word}
					onChange={onChange}
				/>
			</InputWrap>
		</Form>
	);
};

const Form = styled.form`
  margin-bottom: 8px;
`;

const InputWrap = styled.div`
  background: ${({ theme }) => theme.theme.basic.background.primary.default};
  color: ${({ theme }) => theme.theme.basic.ui.secondary.default};

  border: transparent 2px solid;
  transition: border-color 0.1s ease-out;

  border-radius: 4px;
  padding: 4px 8px;

  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 8px;

  & > *:first-child {
    place-self: center;
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.theme.basic.accent.focus.default};
  }
`;

const Input = styled.input`
  width: 100%;

  color: ${({ theme }) => theme.theme.basic.ui.primary.default};

  &::placeholder {
    color: ${({ theme }) => theme.theme.basic.ui.secondary.inactive};
  }

  &::-webkit-search-cancel-button {
    cursor: pointer;
  }
`;
