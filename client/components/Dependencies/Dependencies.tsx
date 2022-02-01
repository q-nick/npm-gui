import type { VFC } from 'react';
import { useCallback } from 'react';

import { getNormalizedRequiredVersion } from '../../utils';
import { DependenciesHeader } from './components/DependenciesHeader';
import { DependenciesTable } from './components/DependenciesTable';
import { useAvailableManagers } from './hooks/use-available-managers';
import { useDependencies } from './hooks/use-dependencies';
import { useFilterDependencies } from './hooks/use-filter-dependencies';

interface Props {
  projectPath: string;
}

export const Dependencies: VFC<Props> = ({ projectPath }) => {
  const {
    dependencies,
    dependenciesProcessing,
    onInstallAllDependencies,
    onInstallNewDependency,
    onDeleteDependency,
    onUpdateDependencies,
  } = useDependencies(projectPath);

  const {
    dependenciesFiltered,
    isEmpty,
    isLoading,
    filterNameValue,
    setFilterNameValue,
    filterTypeValue,
    setFilterTypeValue,
  } = useFilterDependencies(dependencies);

  const onUpdateFilteredDependencies = useCallback(
    (versionType: 'installed' | 'latest' | 'wanted'): void => {
      if (!dependenciesFiltered) {
        return;
      }
      const dependenciesToUpdate = dependenciesFiltered
        .filter(
          (dependency) =>
            typeof dependency[versionType] === 'string' &&
            dependency[versionType] !==
              getNormalizedRequiredVersion(dependency.required),
        )
        .map((dependency) => ({
          name: dependency.name,
          type: dependency.type,
          version: dependency[versionType]!,
        }));
      onUpdateDependencies(dependenciesToUpdate);
    },
    [dependenciesFiltered, onUpdateDependencies],
  );

  const { availableManagers } = useAvailableManagers();

  return (
    <>
      <DependenciesHeader
        availableManagers={availableManagers}
        isGlobal={projectPath === 'global'}
        onForceReInstall={onInstallAllDependencies}
        onInstallAll={onInstallAllDependencies}
        onInstallNewDependency={onInstallNewDependency}
        onUpdateAllToInstalled={(): void => {
          onUpdateFilteredDependencies('installed');
        }}
        onUpdateAllToLatest={(): void => {
          onUpdateFilteredDependencies('latest');
        }}
        onUpdateAllToWanted={(): void => {
          onUpdateFilteredDependencies('wanted');
        }}
      />

      <DependenciesTable
        dependencies={dependenciesFiltered}
        dependenciesProcessing={dependenciesProcessing}
        filterNameValue={filterNameValue}
        filterTypeValue={filterTypeValue}
        isEmpty={isEmpty}
        isGlobal={projectPath === 'global'}
        isLoading={isLoading}
        onDeleteDependency={onDeleteDependency}
        onInstallDependencyVersion={onInstallNewDependency}
        setFilterNameValue={setFilterNameValue}
        setFilterTypeValue={setFilterTypeValue}
      />
    </>
  );
};
