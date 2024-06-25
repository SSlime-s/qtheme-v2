import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

import { BlockStyle } from "@/components/layout/Sidebar";

interface Props {
	submit?: () => void;
	isSubmitting?: boolean;
	shareUrl?: string;
}

export const Sidebar: React.FC<Props> = ({
	submit,
	isSubmitting,
	shareUrl,
}) => {
	return (
		<>
			<SubmitButtonWrapper data-is-submitting={isSubmitting}>
				<SubmitButton onClick={submit} disabled={isSubmitting}>
					Submit
				</SubmitButton>
			</SubmitButtonWrapper>
			<ShareButton href={shareUrl} target="_blank" rel="noopener noreferrer">
				Share
			</ShareButton>
		</>
	);
};

const rotateKeyframe = keyframes`
  from {
    transform: translate(-50%, -50%) rotate(0turn);
  }
  to {
    transform: translate(-50%, -50%) rotate(1turn);
  }
`;

const SubmitButtonWrapper = styled.div`
  position: relative;
  overflow: hidden;
  margin: -2px -2px 14px -2px;
  padding: 2px;
  border-radius: 6px;
  z-index: 0;

  &::before {
    content: '';
    position: absolute;
    z-index: -2;
    left: 50%;
    top: 50%;
    width: 200%;
    height: 1000%;
    aspect-ratio: 1 / 1;
    background-color: transparent;
    background-repeat: no-repeat;
    background-size:
      50% 50%,
      50% 50%;
    background-position:
      0 0,
      100% 0,
      100% 100%,
      0 100%;
    background-image: linear-gradient(transparent, transparent),
      linear-gradient(transparent, transparent),
      linear-gradient(transparent, transparent),
      linear-gradient(
        ${({ theme }) => theme.theme.basic.accent.primary.default},
        ${({ theme }) => theme.theme.basic.accent.primary.default}
      );
    transform-origin: center;
    animation: ${rotateKeyframe} 3s linear infinite;
  }

  &[data-is-submitting='false'] {
    &::before {
      display: none;
    }
  }
`;

const SubmitButton = styled.button`
  ${BlockStyle}
  margin-bottom: 0px;
  cursor: pointer;
`;

const ShareButton = styled.a`
  ${BlockStyle}
  cursor: pointer;
`;
