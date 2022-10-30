/* eslint-disable styled-components-a11y/no-onchange */
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import type { Manager } from '../../../../../server/types/dependency.types';
import type { AvailableManagerResponse } from '../../../../../server/types/global.types';
import { fetchJSON } from '../../../../service/utils';
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
`;

export const DependenciesHeader: React.FC<Props> = ({
  onInstallAll,
  onForceReInstall,
  isGlobal,
}) => {
  const { data: availableManagers } = useQuery(
    ['available-managers'],
    () => fetchJSON<AvailableManagerResponse>(`/api/available-managers`),
    { refetchOnMount: false, refetchOnWindowFocus: false },
  );

  return (
    <header>
      <Search />

      <RightSection>
        {isGlobal !== true && (
          <>
            <small>Install:</small>
            &nbsp;
            <Button
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
