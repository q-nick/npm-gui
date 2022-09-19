import type { VFC } from 'react';
import { useCallback } from 'react';

import type { DependencyInstalledExtras } from '../../../server/types/dependency.types';
import { getNormalizedRequiredVersion } from '../../utils';
import { DependenciesHeader } from './components/DependenciesHeader';
import { DependenciesTable } from './components/DependenciesTable';
import { useAvailableManagers } from './hooks/use-available-managers';
import { useBundleSize } from './hooks/use-bundle-size';
import { useDependencies } from './hooks/use-dependencies';
import { useFilterDependencies } from './hooks/use-filter-dependencies';
import { useScoring } from './hooks/use-scoring';

interface Props {
  projectPath: string;
  dependencies?: DependencyInstalledExtras[];
}

export const Dependencies: VFC<Props> = ({ projectPath, dependencies }) => {
  const {
    dependenciesFiltered,
    isEmpty,
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
          version: dependency[versionType] ?? undefined,
        }));
      onUpdateDependencies(dependenciesToUpdate);
    },
    [dependenciesFiltered, onUpdateDependencies],
  );

  return (
    <>
      <DependenciesHeader
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
        isLoading={dependencies === undefined}
        onDeleteDependency={onDeleteDependency}
        onInstallDependencyVersion={onInstallNewDependency}
        setFilterNameValue={setFilterNameValue}
        setFilterTypeValue={setFilterTypeValue}
      />
    </>
  );
};
