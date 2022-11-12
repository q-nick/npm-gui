import type { ReactNode } from 'react';
import styled from 'styled-components';

import type { DependencyInstalledExtras } from '../../../../../server/types/dependency.types';
import type { CSSType } from '../../../../Styled';
import type { TableRowAbstract } from '../../../../ui/Table/Table';

const Wrapper = styled.div<{ prod: boolean }>`
  text-align: left;
  padding-left: 5px;

  font-weight: ${(props): CSSType => (props.prod ? 'bold' : '')};
`;

export const NameCell = ({
  type,
  name,
  drawFolder,
}: Pick<DependencyInstalledExtras, 'name' | 'type'> &
  TableRowAbstract): ReactNode => {
  return (
    <Wrapper prod={type === 'prod'}>
      {drawFolder && <>&nbsp;└─ </>}
      {name}
    </Wrapper>
  );
};
