import type { VFC } from 'react';
import styled from 'styled-components';

import { Icon } from './Icon/Icon';

const LoaderStyled = styled.span`
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }

  i {
    margin-bottom: 0;
    filter: unset;
  }
`;

export const Loader: VFC = () => (
  <LoaderStyled>
    <Icon glyph="reload" />
  </LoaderStyled>
);
