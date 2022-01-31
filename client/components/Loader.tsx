import type { VFC } from 'react';
import styled from 'styled-components';

const LoaderStyled = styled.span`
  font-size: inherit;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const Loader: VFC = () => (
  <LoaderStyled aria-owns="s" className="oi" data-glyph="reload" />
);
