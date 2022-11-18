/* eslint-disable styled-components-a11y/no-onchange */
import styled from 'styled-components';

import type { Manager } from '../../../../../server/types/dependency.types';
import { useProjectStore } from '../../../../app/ContextStore';
import { useAvailableManagers } from '../../../../hooks/use-available-managers';
import { useMutateReinstall } from '../../../../hooks/use-mutate-reinstall';
import { useProjectPath } from '../../../../hooks/use-project-path';
import { Button } from '../../../../ui/Button/Button';
import { Search } from './Search/Search';

const RightSection = styled.div`
  float: right;
`;

interface Props {
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

export const DependenciesHeader: React.FC<Props> = ({ isGlobal }) => {
  const projectPath = useProjectPath();
  const { project } = useProjectStore(projectPath);
  const availableManagers = useAvailableManagers();
  const reinstallMutation = useMutateReinstall(projectPath);

  return (
    <header>
      <Search />

      <RightSection>
        {isGlobal !== true && (
          <>
            <small>Install:</small>
            &nbsp;
            <Button
              disabled={project?.isBusy}
              icon="data-transfer-download"
              onClick={(): void => reinstallMutation.mutate(undefined)}
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
              disabled={project?.isBusy}
              onChange={(event): void =>
                reinstallMutation.mutate(event.target.value as Manager)
              }
              style={{ display: 'inline-block' }}
              title="Remove and re-install all packages"
              value=""
            >
              <option disabled value="">
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
