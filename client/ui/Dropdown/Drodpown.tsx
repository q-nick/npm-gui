import type { FC, ReactNode } from 'react';
import { useCallback, useState } from 'react';
import styled, { css } from 'styled-components';

import { useClickOutsideRef } from '../../hooks/use-click-outside';
import type { CSSType } from '../../Styled';

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Invisible = styled.div`
  pointer-events: none;
  visibility: hidden;
`;

const Trigger = styled.div`
  position: relative;

  ${({ isOpen }: { isOpen: boolean }): CSSType =>
    isOpen &&
    css`
      z-index: 2;
    `}
`;

const Content = styled.div`
  background: transparent;
  max-height: 0;
  max-width: 0;
  overflow: hidden;
  padding: 7.5px;
  top: -7.5px;
  left: -7.5px;
  position: absolute;
  z-index: 1;
  transition: max-width 300ms, max-height 300ms;

  ${({ isOpen }: { isOpen: boolean }): CSSType =>
    isOpen &&
    css`
      border: 1px solid #fff;
      border-radius: 2px;
      background: #fff;
      border-color: #dfd7ca;
      max-height: 1000px;
      max-width: 1000px;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    `}
`;

interface Props {
  children: [
    (onToggleOpen: (forceState?: boolean) => void) => ReactNode,
    (onToggleOpen: (forceState?: boolean) => void) => ReactNode,
  ];
}

export const Dropdown: FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onToggleOpen = useCallback((forceState?: boolean) => {
    setIsOpen((previousIsOpen) =>
      forceState !== undefined ? forceState : !previousIsOpen,
    );
  }, []);

  const ref = useClickOutsideRef(onClose);

  return (
    <Wrapper ref={ref}>
      <Trigger isOpen={isOpen}>{children[0](onToggleOpen)}</Trigger>
      <Content isOpen={isOpen}>
        <Invisible>{children[0](onToggleOpen)}</Invisible>
        {children[1](onToggleOpen)}
      </Content>
    </Wrapper>
  );
};
