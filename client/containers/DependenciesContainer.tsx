import React, { useCallback, useEffect, useState } from 'react';
import Axios from 'axios';
import { DependenciesHeader } from '../components/Dependencies/DependenciesHeader';
import { DependenciesTable } from '../components/Dependencies/DependenciesTable';
import { SearchContainer } from './SearchContainer';

interface Props {
  projectPath?: string;
  filtersEnabled?: ('name' | 'type')[];
}

function getBasePathFor(projectPath?: string): string {
  if (projectPath) {
    return `/api/project/${projectPath}/dependencies`;
  }

  return 'api/global/dependencies';
}

export function DependenciesContainer({ projectPath, filtersEnabled }:Props): JSX.Element {
  const [dependencies, setDependencies] = useState<{ [key: string]: Dependency.Entire[] } >();

  const fetchDependencies = useCallback(async () => {
    const responseSimple = await Axios
      .get(`${getBasePathFor(projectPath)}/simple`);

    setDependencies(responseSimple.data);

    const responseFull = await Axios
      .get(`${getBasePathFor(projectPath)}`);

    setDependencies(responseFull.data);
  }, [projectPath]);

  const onInstallAll = useCallback(() => {}, []);
  const onUpdateAllToInstalled = useCallback(() => {}, []);
  const onUpdateAllToWanted = useCallback(() => {}, []);
  const onUpdateAllToLatest = useCallback(() => {}, []);
  const onForceReInstall = useCallback(() => {}, []);
  const onInstallNewDependency = useCallback(() => {}, []);

  useEffect(() => {
    fetchDependencies();
  }, [fetchDependencies]);

  return (
    <>
      <DependenciesHeader
        onInstallAll={onInstallAll}
        onUpdateAllToInstalled={onUpdateAllToInstalled}
        onUpdateAllToWanted={onUpdateAllToWanted}
        onUpdateAllToLatest={onUpdateAllToLatest}
        onForceReInstall={onForceReInstall}
      >
        <SearchContainer
          type={projectPath ? 'project' : 'global'}
          onInstall={onInstallNewDependency}
        />
      </DependenciesHeader>
      {dependencies && (
        <DependenciesTable
          dependencies={dependencies as any}
          dependenciesProcessing={{}}
          sortKey="sortKey"
          sortReversed={false}
          onSortChange={() => {}}
          onFilterChange={() => {}}
          filters={{}}
          filtersEnabled={[]}
          onDeleteDependency={() => {}}
          onInstallDependencyVersion={() => {}}
        />
      )}
    </>
  );
}
