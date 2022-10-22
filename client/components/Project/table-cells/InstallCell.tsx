import type { ReactNode } from 'react';
import styled from 'styled-components';

import type { DependencyInstalledExtras } from '../../../../server/types/dependency.types';
import { Install } from '../components/Install';

const Wrapper = styled.div`
  border-right: 1px solid #dfd7ca;
  background: #f8f5f0;
  height: 24px;
  font-weight: bold;
`;

export const InstallCell = (
  dependency: DependencyInstalledExtras,
): ReactNode => {
  return (
    <Wrapper>
      <Install dependency={dependency} />
    </Wrapper>
  );
};
