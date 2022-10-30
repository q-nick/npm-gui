import type { FC, ReactNode } from 'react';
import styled from 'styled-components';

import type { SearchResponse } from '../../../../../../server/types/global.types';
import { useMutateInstallDependency } from '../../../../../hooks/use-mutate-install-dependency';
import { Button } from '../../../../../ui/Button/Button';
import { Dropdown } from '../../../../../ui/Dropdown/Drodpown';

interface Props {
  searchItem: SearchResponse[number];
}

const Row = styled.div`
  white-space: nowrap;
`;

export const SearchInstall: FC<Props> = ({ searchItem }) => {
  const installDependencyMutation = useMutateInstallDependency();

  return (
    <Dropdown>
      {(onToggleOpen): ReactNode => (
        <Button
          icon="caret-right"
          onClick={(): void => onToggleOpen()}
          title={`Install ${searchItem.version} version of ${searchItem.name}`}
          variant="success"
        >
          {searchItem.version}
        </Button>
      )}
      {(onToggleOpen): ReactNode => (
        <Row>
          <hr />
          <Button
            onClick={(): void => {
              installDependencyMutation.mutate({
                type: 'prod',
                name: searchItem.name,
                version: searchItem.version,
              });
              onToggleOpen();
            }}
            title={`Install ${searchItem.version} as production dependency`}
            variant="info"
          >
            install as prod
          </Button>
          <Button
            onClick={(): void => {
              installDependencyMutation.mutate({
                type: 'dev',
                name: searchItem.name,
                version: searchItem.version,
              });
              onToggleOpen();
            }}
            title={`Install ${searchItem.version} as development dependency`}
            variant="info"
          >
            install as dev
          </Button>
        </Row>
      )}
    </Dropdown>
  );
};
