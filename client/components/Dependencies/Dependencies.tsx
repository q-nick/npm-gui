import React, { useCallback } from 'react';
import { DependenciesHeader } from './components/DependenciesHeader';
import { DependenciesTable } from './components/DependenciesTable';
import { DependenciesContext } from './DependenciesContext';
import { useDependencies } from './hooks/useDependencies';
import { Search } from './components/Search/Search';

interface Props {
  projectPath: string;
  filtersEnabled?: ('name' | 'type')[];
}

export function Dependencies({ projectPath, filtersEnabled }:Props): JSX.Element {
  const {
    dependencies,
    onInstallNewDependency,
    onInstallAllDependencies,
    onForceInstallAllDependencies,
  } = useDependencies(projectPath);

  const onUpdateAllToInstalled = useCallback(() => {}, []);
  const onUpdateAllToWanted = useCallback(() => {}, []);
  const onUpdateAllToLatest = useCallback(() => {}, []);

  return (
    <DependenciesContext.Provider value={{
      dependencies,
      onInstallNewDependency,
      onInstallAllDependencies,
      onForceInstallAllDependencies
    }}>
      <DependenciesHeader
        onInstallAll={onInstallAllDependencies}
        onUpdateAllToInstalled={onUpdateAllToInstalled}
        onUpdateAllToWanted={onUpdateAllToWanted}
        onUpdateAllToLatest={onUpdateAllToLatest}
        onForceReInstall={onForceInstallAllDependencies}
      />
      {dependencies && (
        <DependenciesTable
          dependencies={dependencies}
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
    </DependenciesContext.Provider>
  );
}
