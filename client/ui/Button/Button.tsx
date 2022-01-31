import type { ComponentPropsWithoutRef } from 'react';
import { Children } from 'react';
import styled, { css } from 'styled-components';

import type { CSSType } from '../../Styled';
import type { Props as IconPropsOriginal } from '../Icon/Icon';
import { Icon } from '../Icon/Icon';

export interface Props extends ComponentPropsWithoutRef<'button'> {
  variant: 'danger' | 'dark' | 'info' | 'primary' | 'success' | 'warning';
  icon?: string;
  scale?: 'small';
  lowercase?: boolean;
}

const variantToColor = {
  danger: '#d9534f',
  dark: '#3e3f3a',
  info: '#1b8dbb',
  primary: '#325d88',
  success: '#79a736',
  warning: '#ef5c0e',
};

const ButtonStyled = styled.button`
  border: 0;
  border-radius: 2px;
  color: #fff;
  font-family: inherit;
  font-size: 11px;
  font-weight: 500;
  outline: none;
  padding: 8px;
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

  ${({ variant }: Readonly<Props>): CSSType => css`
    background-color: ${variantToColor[variant]};
  `}

  ${({ scale }: Readonly<Props>): CSSType =>
    scale === 'small' &&
    css`
      font-size: 10px;
      padding: 6px;
    `}

  ${({ lowercase }: Readonly<Props>): CSSType => css`
    text-transform: ${lowercase === true ? 'unset' : 'uppercase'};
  `}
`;

interface IconProps extends IconPropsOriginal {
  isAlone: boolean;
}

const ButtonIcon = styled(Icon)<IconProps>`
  margin-right: 3px;
  vertical-align: middle;

  ${({ isAlone }: Readonly<IconProps>): CSSType =>
    isAlone &&
    css`
      margin-right: 0;
    `}
`;

export const Button: React.FC<Readonly<Props>> = ({
  icon,
  children,
  ...props
}) => (
  <ButtonStyled {...props}>
    {icon !== undefined && (
      <ButtonIcon
        glyph={icon}
        isAlone={Children.toArray(children).length === 0}
      />
    )}

    {children}
  </ButtonStyled>
);
