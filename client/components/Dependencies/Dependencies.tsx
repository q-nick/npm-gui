import { useCallback } from 'react';
import { getNormalizedRequiredVersion } from '../../utils';
import { DependenciesHeader } from './components/DependenciesHeader';
import { DependenciesTable } from './components/DependenciesTable';
import { useAvailableManagers } from './hooks/useAvailableManagers';
import { useDependencies } from './hooks/useDependencies';
import { useFilterDependencies } from './hooks/useFilterDependencies';

interface Props { projectPath: string }

export function Dependencies({ projectPath }: Props): JSX.Element {
  const {
    dependencies,
    dependenciesProcessing,
    onInstallAllDependencies,
    onInstallNewDependency,
    onDeleteDependency,
    onUpdateDependencies,
  } = useDependencies(projectPath);

  const {
    dependenciesFiltered, isEmpty, isLoading,
    filterNameValue, setFilterNameValue,
    filterTypeValue, setFilterTypeValue,
  } = useFilterDependencies(dependencies);

  const onUpdateFilteredDependencies = useCallback((versionType: 'installed' | 'latest' | 'wanted'): void => {
    if (!dependenciesFiltered) { return; }
    const dependenciesToUpdate = dependenciesFiltered
      .filter((dependency) => typeof dependency[versionType] === 'string'
        && dependency[versionType] !== getNormalizedRequiredVersion(dependency.required))
      .map((dependency) => ({
        name: dependency.name,
        version: dependency[versionType]!, // eslint-disable-line
        type: dependency.type,
      }));
    onUpdateDependencies(dependenciesToUpdate);
  }, [dependenciesFiltered, onUpdateDependencies]);

  const { availableManagers } = useAvailableManagers();

  return (
    <>
      <DependenciesHeader
        availableManagers={availableManagers}
        isGlobal={projectPath === 'global'}
        onForceReInstall={(): void => { onInstallAllDependencies(true); }}
        onInstallAll={onInstallAllDependencies}
        onInstallNewDependency={onInstallNewDependency}
        onUpdateAllToInstalled={(): void => { onUpdateFilteredDependencies('installed'); }}
        onUpdateAllToLatest={(): void => { onUpdateFilteredDependencies('latest'); }}
        onUpdateAllToWanted={(): void => { onUpdateFilteredDependencies('wanted'); }}
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
}
