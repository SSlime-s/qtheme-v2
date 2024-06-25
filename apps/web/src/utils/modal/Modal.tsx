import styled from "@emotion/styled";
import dynamic from "next/dynamic";
import ReactDOM from "react-dom";

import type { PropsWithChildren } from "react";

const ModalPortalRaw: React.FC<PropsWithChildren> = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};
const ModalPortal = dynamic(() => Promise.resolve(ModalPortalRaw), {
  ssr: false,
});

export const Modal: React.FC<
  PropsWithChildren<React.ComponentProps<"div">>
> = ({ children, ...props }) => {
  return (
    <ModalPortal>
      <Overlay {...props}>{children}</Overlay>
    </ModalPortal>
  );
};
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: #00000026;
  z-index: 1000;
`;
