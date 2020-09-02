import * as React from 'react';
import styled, { css } from 'styled-components';
import { Button } from '../../ui/Button/Button';
import { Loader } from '../Loader/Loader';
import { ConfirmButton } from '../../ui/ConfirmButton/ConfirmButton';
import { Icon } from '../../ui/Icon/Icon';

interface Props {
  dependency: Dependency.Entire;
  isProcessing: boolean;
  onDeleteDependency: (dependency: Dependency.Entire) => void;
  onInstallDependencyVersion: (dependency: Dependency.Entire, version: string) => void;
}

function getNormalizedVersion(version?: string | null): string | null {
  if (!version) {
    return null;
  }
  const match = version.match(/\d.+/);
  if (!match) {
    return version;
  }
  return match[0];
}

interface TrStyledProps {
  isProcessing:boolean;
}

const TrStyled = styled.tr`
  @keyframes Gradient {
    0% {
      background-position: 0% 50%;
    }

    50% {
      background-position: 100% 50%;
    }

    100% {
      background-position: 0% 50%;
    }
  }

  ${({ isProcessing }: TrStyledProps) => isProcessing && css`
    background: linear-gradient(-45deg, #dfd7ca, #fff);
    background-size: 200% 200%;
    animation: Gradient 2s ease infinite;
  `}
`;

const ColumnName = styled.td`
  text-align: left;
  padding-left: 5px;
`;

const ColumnVersion = styled.td`
  width: 10%;
  min-width: 80px;
`;

const ColumnAction = styled.td`
  width: 30px;
`;

const RepoName = styled.span`
  border-radius: 2px;
  color: #fff;
  float: right;
  font-size: 0.8em;
  font-weight: bold;
  padding: 0.2em 0.4em;
  background: #ef5c0e;
`;

const Missing = styled.span`
  color: #d9534f;
`;

interface VersionProps {
  dependency: Dependency.Entire;
  isProcessing: boolean;
  onInstall: (version: string) => void;
}

function InstalledVersion({ dependency, isProcessing, onInstall }:VersionProps): JSX.Element {
  const dependencyInstalled = dependency.installed;

  if (dependencyInstalled === undefined) {
    return <Loader />;
  }

  if (dependencyInstalled === null) {
    return <Missing>missing</Missing>;
  }

  if (getNormalizedVersion(dependency.required) === dependencyInstalled) {
    return (
      <span>
        {dependencyInstalled}
        {dependency.unused && <Icon title="Probably this dependency is unused" glyph="fork" />}
      </span>
    );
  }

  return (
    <Button
      disabled={isProcessing}
      icon="cloud-download"
      variant="success"
      scale="small"
      onClick={() => onInstall(dependencyInstalled)}
      title={`Install ${dependencyInstalled} version of ${dependency.name}`}
    >
      {dependencyInstalled}
      {dependency.unused && <Icon title="Probably this dependency is unused" glyph="fork" />}
    </Button>
  );
}

function WantedVersion({ dependency, isProcessing, onInstall }:VersionProps):JSX.Element {
  const dependencyWanted = dependency.wanted;

  if (dependencyWanted === null) {
    return <>-</>;
  }

  if (dependencyWanted) {
    return (
      <Button
        disabled={isProcessing}
        icon="cloud-download"
        variant="success"
        scale="small"
        onClick={() => onInstall(dependencyWanted)}
        title={`Install ${dependencyWanted} version of ${dependency.name}`}
      >
        {dependencyWanted}
      </Button>
    );
  }

  return <></>;
}

function LatestVersion({ dependency, isProcessing, onInstall }:VersionProps):JSX.Element {
  const dependencyLatest = dependency.latest;

  if (dependencyLatest === null) {
    return <>-</>;
  }

  if (dependencyLatest) {
    return (
      <Button
        disabled={isProcessing}
        icon="cloud-download"
        variant="success"
        scale="small"
        onClick={() => onInstall(dependencyLatest)}
        title={`Install ${dependencyLatest} version of ${dependency.name}`}
      >
        {dependencyLatest}
      </Button>
    );
  }

  return <></>;
}

export function DependencyRow({
  dependency, isProcessing, onDeleteDependency, onInstallDependencyVersion,
}:Props):JSX.Element {
  return (
    <TrStyled
      key={`${dependency.name}${dependency.repo}`}
      isProcessing={isProcessing}
    >
      <td>{dependency.type !== 'prod' && dependency.type}</td>
      <ColumnName>
        {dependency.name}
        <RepoName>{dependency.repo}</RepoName>
      </ColumnName>
      {/* <td className={style.columnNsp}> ? </td> */}
      <ColumnVersion>
        {dependency.required}
        {!dependency.required && <Missing>extraneous</Missing>}
      </ColumnVersion>
      <ColumnVersion>
        <InstalledVersion
          isProcessing={isProcessing}
          dependency={dependency}
          onInstall={(version) => onInstallDependencyVersion(dependency, version)}
        />
      </ColumnVersion>
      <ColumnVersion>
        <WantedVersion
          isProcessing={isProcessing}
          dependency={dependency}
          onInstall={(version) => onInstallDependencyVersion(dependency, version)}
        />
      </ColumnVersion>
      <ColumnVersion>
        <LatestVersion
          isProcessing={isProcessing}
          dependency={dependency}
          onInstall={(version) => onInstallDependencyVersion(dependency, version)}
        />
      </ColumnVersion>
      <ColumnAction>
        <ConfirmButton
          disabled={isProcessing}
          icon="trash"
          variant="danger"
          scale="small"
          onClick={() => onDeleteDependency(dependency)}
        />
      </ColumnAction>
    </TrStyled>
  );
}
