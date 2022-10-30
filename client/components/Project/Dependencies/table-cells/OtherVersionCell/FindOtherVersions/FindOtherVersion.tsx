import type { FC, ReactNode } from 'react';
import styled from 'styled-components';

import type { DependencyInstalledExtras } from '../../../../../../../server/types/dependency.types';
import { Button } from '../../../../../../ui/Button/Button';
import { Dropdown } from '../../../../../../ui/Dropdown/Drodpown';
import { useFindOtherVersion } from './use-find-other-version';
import { VersionColumn } from './VersionColumn';

interface Props {
  dependency: DependencyInstalledExtras;
}

const ColumnsFlex = styled.div`
  display: flex;
  flex-direction: row;
`;

export const FindOtherVersion: FC<Props> = ({ dependency }) => {
  const {
    setMajor,
    setMinor,
    versionsMajor,
    versionsMinor,
    versionsPatch,
    selectedMajor,
    selectedMinor,
  } = useFindOtherVersion(dependency);

  return (
    <Dropdown>
      {(onToggleOpen): ReactNode => (
        <Button
          disabled={!dependency.versions}
          onClick={(): void => onToggleOpen(true)}
          title={`Choose specific version of ${dependency.name}`}
          variant="dark"
        >
          =&gt;
        </Button>
      )}

      {(onToggleOpen): ReactNode => (
        <>
          <hr />
          <ColumnsFlex>
            <VersionColumn
              dependency={dependency}
              onClick={onToggleOpen}
              onMouseEnter={(version): void => {
                setMajor(version);
                setMinor(undefined);
              }}
              selectedVersion={selectedMajor}
              versions={versionsMajor}
            />
            &nbsp;
            <VersionColumn
              dependency={dependency}
              onClick={onToggleOpen}
              onMouseEnter={(version): void => {
                setMinor(version);
              }}
              selectedVersion={selectedMinor}
              versions={versionsMinor}
            />
            &nbsp;
            <VersionColumn
              dependency={dependency}
              onClick={onToggleOpen}
              selectedVersion={selectedMinor}
              versions={versionsPatch}
            />
          </ColumnsFlex>
        </>
      )}
    </Dropdown>
  );
};
