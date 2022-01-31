import type { ReactNode } from 'react';
import styled from 'styled-components';

const Backdrop = styled.div`
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 5;
`;

const ModalBody = styled.div`
  background: white;
  min-width: 400px;
  max-width: 80vw;
  min-height: 400px;
  max-height: 80vh;
  overflow-y: scroll;
  padding: 10px;
`;

interface Props {
  onClose: () => void;
  children: ReactNode;
}

export const Modal: React.FC<Props> = ({ children, onClose }) => (
  <Backdrop onClick={onClose} role="button">
    <ModalBody>{children}</ModalBody>
  </Backdrop>
);
