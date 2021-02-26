import React, { useCallback } from 'react';
import { DependenciesHeader } from './components/DependenciesHeader';
import { DependenciesTable } from './components/DependenciesTable';
import { DependenciesContext } from './DependenciesContext';
import { useDependencies } from './hooks/useDependencies';

interface Props {
  projectPath: string;
}

export function Dependencies({ projectPath }: Props): JSX.Element {
  const dependenciesContext = useDependencies(projectPath);

  const onUpdateAllToInstalled = useCallback(() => {}, []);
  const onUpdateAllToWanted = useCallback(() => {}, []);
  const onUpdateAllToLatest = useCallback(() => {}, []);

  return (
    <DependenciesContext.Provider value={dependenciesContext}>
      <DependenciesHeader
        onForceReInstall={onForceInstallAllDependencies}
        onInstallAll={onInstallAllDependencies}
        onUpdateAllToInstalled={onUpdateAllToInstalled}
        onUpdateAllToLatest={onUpdateAllToLatest}
        onUpdateAllToWanted={onUpdateAllToWanted}
      />
      {dependencies && (
        <DependenciesTable
          dependencies={dependencies}
          dependenciesProcessing={{}}
          filters={{}}
          filtersEnabled={[]}
          onDeleteDependency={() => {}}
          onFilterChange={() => {}}
          onInstallDependencyVersion={() => {}}
          onSortChange={() => {}}
          sortKey="sortKey"
          sortReversed={false}
        />
      )}
    </DependenciesContext.Provider>
  );
}
