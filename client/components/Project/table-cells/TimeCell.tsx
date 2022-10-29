import type { ReactNode } from 'react';
import styled from 'styled-components';

import { timeSince } from '../components/utils';

const Wrapper = styled.span`
  color: gray;
  font-size: 0.8em;
`;

export const TimeCell = (_: unknown, time: unknown): ReactNode => (
  <Wrapper title={time as string}>
    {time && timeSince(new Date(time as string).getTime())}
  </Wrapper>
);
