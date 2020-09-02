import React, { ComponentPropsWithoutRef } from 'react';
import styled, { css } from 'styled-components';
import { Icon, Props as IconPropsOriginal } from '../Icon/Icon';

export interface Props extends ComponentPropsWithoutRef<'button'> {
  variant: 'dark' | 'primary' | 'warning' | 'danger' | 'success' | 'info';
  icon?: string;
  scale?: 'small';
}

const variantToColor = {
  primary: '#325d88',
  dark: '#3e3f3a',
  warning: '#ef5c0e',
  danger: '#d9534f',
  success: '#79a736',
  info: '#1b8dbb',
};

const ButtonStyled = styled.button<Props>`
  border: 0;
  border-radius: 2px;
  color: #fff;
  font-family: inherit;
  font-size: 11px;
  font-weight: 500;
  outline: none;
  padding: 8px;
  text-transform: uppercase;
  transition: background-color 200ms;
  vertical-align: middle;
  margin-right: 5px;
  white-space: nowrap;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    filter: brightness(90%);
  }

  &:active {
    filter: brightness(80%);
  }

  &:disabled {
    cursor: not-allowed;
    filter: grayscale(100%);
  }

  ${({ variant }: Props) => css`
    background-color: ${variantToColor[variant]};
  `}

  ${({ scale }: Props) => scale === 'small' && css`
    font-size: 10px;
    padding: 6px;
  `}
`;

interface IconProps extends IconPropsOriginal {
  isAlone: boolean;
}

const ButtonIcon = styled(Icon)<IconProps>`
  margin-right: 3px;
  vertical-align: middle;

  ${({ isAlone }: IconProps) => isAlone && css`
    margin-right: 0;
  `}
`;

export function Button({
  icon, children, ...props
}:Props):JSX.Element {
  return (
    <ButtonStyled
      {...props as Props} // eslint-disable-line
    >
      {icon && <ButtonIcon glyph={icon} isAlone={!children} />}
      {children}
    </ButtonStyled>
  );
}
