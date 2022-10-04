import type { VFC } from 'react';
import { useCallback } from 'react';

import { getNormalizedRequiredVersion } from '../../utils';
import { DependenciesHeader } from './components/DependenciesHeader';
import { DependenciesTable } from './components/DependenciesTable';
import { useBundleDetails } from './hooks/use-bundle-details';
import { useBundleScore } from './hooks/use-bundle-score';
import { useFastDependencies } from './hooks/use-fast-dependencies';
import { useFilterDependencies } from './hooks/use-filter-dependencies';
import { useFullDependencies } from './hooks/use-full-dependencies';
import { useProjectActions } from './hooks/use-project-actions';

interface Props {
  projectPath: string;
}

export const Project: VFC<Props> = ({ projectPath }) => {
  const {
    onInstallAllDependencies,
    onUpdateDependencies,
    onInstallNewDependency,
    onDeleteDependency,
  } = useProjectActions();

  const [dependenciesFast] = useFastDependencies(projectPath);
  const [dependenciesFull] = useFullDependencies(projectPath);

  const dependenciesRaw = dependenciesFull || dependenciesFast;

  const dependenciesScored = useBundleScore(dependenciesRaw);
  const dependencies = useBundleDetails(dependenciesScored);

  const {
    dependenciesFiltered,
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
        dependenciesProcessing={[]}
        filterNameValue={filterNameValue}
        filterTypeValue={filterTypeValue}
        isEmpty={dependencies?.length === 0}
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
