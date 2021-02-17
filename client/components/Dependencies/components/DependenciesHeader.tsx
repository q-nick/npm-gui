import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Button } from '../../../ui/Button/Button';
import { Search } from './Search/Search';

const RightSection = styled.div`
  float: right;
`;

interface Props {
  onInstallAll: () => void;
  onUpdateAllToInstalled: () => void;
  onUpdateAllToWanted: () => void;
  onUpdateAllToLatest: () => void;
  onForceReInstall: () => void;
}

export function DependenciesHeader({
  onInstallAll,
  onUpdateAllToInstalled,
  onUpdateAllToWanted,
  onUpdateAllToLatest,
  onForceReInstall,
}:Props):JSX.Element {
  return (
    <header>
      <Search />
      <RightSection>
        <small>Install:</small>
        &nbsp;
        <Button
          variant="primary"
          scale="small"
          icon="data-transfer-download"
          onClick={onInstallAll}
        >
          All
        </Button>
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
        <Button
          variant="success"
          scale="small"
          icon="cloud-download"
          onClick={onUpdateAllToInstalled}
          title="Reinstall all packages without changing package.json"
        >
          Installed
        </Button>
        <Button
          variant="success"
          scale="small"
          icon="cloud-download"
          onClick={onUpdateAllToWanted}
          title="Install all wanted package version"
        >
          Wanted
        </Button>
        <Button
          variant="success"
          scale="small"
          icon="cloud-download"
          onClick={onUpdateAllToLatest}
          title="Install all latest packages version"
        >
          Latest
        </Button>
        &nbsp;
        &nbsp;
        <Button
          variant="danger"
          scale="small"
          icon="loop-circular"
          onClick={onForceReInstall}
          title="Remove and re-nstall all packages"
        >
          Re-Install
        </Button>
      </RightSection>
    </header>
  );
}
