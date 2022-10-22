import type { ReactNode } from 'react';
import styled from 'styled-components';

import type { DependencyInstalledExtras } from '../../../../server/types/dependency.types';
import { timeSince } from '../components/utils';

const Wrapper = styled.span`
  color: gray;
  font-size: 0.8em;
`;

export const TimeCell = ({ updated }: DependencyInstalledExtras): ReactNode => (
  <Wrapper title={updated}>
    {updated && timeSince(new Date(updated).getTime())}
  </Wrapper>
);
