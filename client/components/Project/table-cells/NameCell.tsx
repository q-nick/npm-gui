import type { ReactNode } from 'react';
import styled from 'styled-components';

import type { DependencyInstalledExtras } from '../../../../server/types/dependency.types';
import type { CSSType } from '../../../Styled';
import type { TableRowAbstract } from '../../../ui/Table/Table';

const Wrapper = styled.div<{ prod: boolean }>`
  text-align: left;
  padding-left: 5px;

  font-weight: ${(props): CSSType => (props.prod ? 'bold' : '')};
`;

export const NameCell = (
  { type, name }: Pick<DependencyInstalledExtras, 'name' | 'type'>,
  row: unknown,
): ReactNode => {
  return (
    <Wrapper prod={type === 'prod'}>
      {(row as TableRowAbstract).drawFolder && <>&nbsp;└─ </>}
      {name}
    </Wrapper>
  );
};
