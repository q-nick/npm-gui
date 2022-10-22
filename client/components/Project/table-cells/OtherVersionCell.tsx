import type { ReactNode } from 'react';
import styled from 'styled-components';

// import type { DependencyInstalledExtras } from '../../../../server/types/dependency.types';
// import { Button } from '../../../ui/Button/Button';

const Wrapper = styled.div`
  background: #f8f5f0;
  height: 24px;
  font-weight: bold;
`;

export const OtherVersionCell = (): ReactNode => {
  return (
    <Wrapper>
      =&gt;
      {/* <Button title={`Choose specific version of ${name}`} variant="dark">
        =&gt;
      </Button> */}
    </Wrapper>
  );
};
