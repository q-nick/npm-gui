/* eslint-disable styled-components-a11y/no-onchange */
import styled from 'styled-components';

import type { Manager } from '../../../../../server/types/dependency.types';
import { useAvailableManagers } from '../../../../hooks/use-available-managers';
import { useIsProjectBusy } from '../../../../hooks/use-is-project-busy';
import { useProjectPath } from '../../../../hooks/use-project-path';
import { Button } from '../../../../ui/Button/Button';
import { Search } from './Search/Search';

const RightSection = styled.div`
  float: right;
`;

interface Props {
  onInstallAll: () => void;
  onForceReInstall: (manager: Manager) => void;
  isGlobal?: boolean;
}

const Select = styled.select`
  border: 0;
  border-radius: 2px;
  color: #fff;
  font-family: inherit;
  font-size: 11px;
  font-weight: 500;
  outline: none;
  padding: 8px;
  -webkit-transition: background-color 200ms;
  transition: background-color 200ms;
  vertical-align: middle;
  margin-right: 5px;
  white-space: nowrap;
  background-color: #d9534f;
  font-size: 10px;
  padding: 6px;

  &:disabled {
    cursor: not-allowed;
    background-color: #959595 !important;
  }
`;

export const DependenciesHeader: React.FC<Props> = ({
  onInstallAll,
  onForceReInstall,
  isGlobal,
}) => {
  const projectPath = useProjectPath();
  const availableManagers = useAvailableManagers();
  const isProjectBusy = useIsProjectBusy(projectPath);

  return (
    <header>
      <Search />

      <RightSection>
        {isGlobal !== true && (
          <>
            <small>Install:</small>
            &nbsp;
            <Button
              disabled={isProjectBusy}
              icon="data-transfer-download"
              onClick={(): void => {
                onInstallAll();
              }}
              title="Run install command"
              variant="primary"
            >
              All
            </Button>
          </>
        )}
        {isGlobal !== true && (
          <>
            &nbsp; &nbsp;
            <Select
              disabled={isProjectBusy}
              onChange={(event): void => {
                onForceReInstall(event.target.value as Manager);
              }}
              style={{ display: 'inline-block' }}
              title="Remove and re-install all packages"
            >
              <option disabled selected value="">
                Re-Install
              </option>

              <option disabled={availableManagers?.npm === false} value="npm">
                npm
              </option>

              <option disabled={availableManagers?.yarn === false} value="yarn">
                yarn
              </option>

              <option disabled={availableManagers?.pnpm === false} value="pnpm">
                pnpm
              </option>
            </Select>
          </>
        )}
      </RightSection>
    </header>
  );
};
