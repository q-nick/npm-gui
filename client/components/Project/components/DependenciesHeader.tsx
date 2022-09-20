/* eslint-disable styled-components-a11y/no-onchange */
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import type {
  Basic,
  Manager,
  Type,
} from '../../../../server/types/dependency.types';
import { getAvailableManagers } from '../../../service/others.service';
import { Button } from '../../../ui/Button/Button';
import { Search } from './Search/Search';

const RightSection = styled.div`
  float: right;
`;

interface Props {
  onInstallNewDependency: (dependency: Basic, type: Type) => void;
  onInstallAll: () => void;
  onUpdateAllToInstalled: () => void;
  onUpdateAllToWanted: () => void;
  onUpdateAllToLatest: () => void;
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
  text-transform: uppercase;
`;

export const DependenciesHeader: React.FC<Props> = ({
  onInstallNewDependency,
  onInstallAll,
  onUpdateAllToInstalled,
  onUpdateAllToWanted,
  onUpdateAllToLatest,
  onForceReInstall,
  isGlobal,
}) => {
  const { data: availableManagers } = useQuery(
    ['available-managers'],
    getAvailableManagers,
    { refetchOnMount: false, refetchOnWindowFocus: false },
  );

  return (
    <header>
      <Search onInstallNewDependency={onInstallNewDependency} />

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
              scale="small"
              variant="primary"
            >
              All
            </Button>
          </>
        )}
        {/* <Button
            variant="primary"
            scale="small"
            icon="data-transfer-download"
            disabled={true}
          >Prod
          </Button>
          <Button
            variant="dark"
            scale="small"
            icon="data-transfer-download"
            disabled={true}
          >Dev
          </Button> */}
        &nbsp;
        <small>Update all to:</small>
        &nbsp;
        {isGlobal !== true && (
          <Button
            icon="cloud-download"
            onClick={onUpdateAllToInstalled}
            scale="small"
            title="Reinstall all packages without changing package.json"
            variant="success"
          >
            Installed
          </Button>
        )}
        <Button
          icon="cloud-download"
          onClick={onUpdateAllToWanted}
          scale="small"
          title="Install all compatible package version"
          variant="success"
        >
          Compatible
        </Button>
        <Button
          icon="cloud-download"
          onClick={onUpdateAllToLatest}
          scale="small"
          title="Install all latest packages version"
          variant="success"
        >
          Latest
        </Button>
        {isGlobal !== true && (
          <>
            &nbsp; &nbsp;
            <Select
              onChange={(event): void => {
                onForceReInstall(event.target.value as Manager);
              }}
              style={{ display: 'inline-block' }}
              title="Remove and re-nstall all packages"
              value=""
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
