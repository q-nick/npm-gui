import styled from 'styled-components';

import type { Manager } from '../../../../../server/types/dependency.types';
import { useProjectStore } from '../../../../app/ContextStore';
import { useMutateReinstall } from '../../../../hooks/use-mutate-reinstall';
import { useProjectPath } from '../../../../hooks/use-project-path';
import { trpc } from '../../../../trpc';
import { Button } from '../../../../ui/Button/Button';
import { Search } from './Search/Search';

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
  const { data: availableManagers } = trpc.availableManagers.useQuery();
  const reinstallMutation = useMutateReinstall(projectPath);

  return (
    <header>
      <Search />

      <div className="float-right">
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
      </div>
    </header>
  );
};
