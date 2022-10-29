/* eslint-disable no-console */
/* eslint-disable react/jsx-handler-names */
/* eslint-disable import/max-dependencies */
import type { ComponentProps, VFC } from 'react';
import { useCallback } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { DependencyInstalledExtras } from '../../../server/types/dependency.types';
import { Table } from '../../ui/Table/Table';
import { useTableFilter } from '../../ui/Table/use-table-filter';
import { getNormalizedRequiredVersion } from '../../utils';
import { DependenciesHeader } from './components/DependenciesHeader';
import { useBundleDetails } from './hooks/use-bundle-details';
import { useBundleScore } from './hooks/use-bundle-score';
import { useFastDependencies } from './hooks/use-fast-dependencies';
import { useFullDependencies } from './hooks/use-full-dependencies';
import { InstallHeader } from './InstallHeader';
import { ActionsCell } from './table-cells/ActionsCell';
import { CompatibleCell } from './table-cells/CompatibleCell';
import { HomePageCell } from './table-cells/HomePageCell';
import { InstallCell } from './table-cells/InstallCell';
import { InstalledCell } from './table-cells/InstalledCell';
import { LatestCell } from './table-cells/LatestCell';
import { NameCell } from './table-cells/NameCell';
import { NpmCell } from './table-cells/NpmCell';
import { OtherVersionCell } from './table-cells/OtherVersionCell';
import { RepoCell } from './table-cells/RepoCell';
import { RequiredCell } from './table-cells/RequiredCell';
import { ScoreCell } from './table-cells/ScoreCell';
import { SizeCell } from './table-cells/SizeCell';
import { TimeCell } from './table-cells/TimeCell';
import { TypeCell } from './table-cells/TypeCell';

interface Props {
  projectPath: string;
}

const columns: ComponentProps<typeof Table<DependencyInstalledExtras>>['columns'] = [
  {
    name: 'type',
    sortable: true,
    filterable: ['any', 'dev', 'prod'],
    label: '',
    render: TypeCell,
  },
  { name: 'name', sortable: true, filterable: true, render: NameCell },
  {
    name: 'homepage',
    label: '',
    render: HomePageCell,
  },
  {
    name: 'repo',
    label: '',
    render: RepoCell,
  },
  {
    name: 'npm',
    label: '',
    render: NpmCell,
  },
  { name: 'score', sortable: true, render: ScoreCell },
  { name: 'size', sortable: true, render: SizeCell },
  {
    name: 'updated',
    sortable: true,
    render: TimeCell,
  },
  { name: 'required', sortable: true, render: RequiredCell },
  {
    name: 'to',
    label: '',
    render: OtherVersionCell,
  },
  {
    name: 'install',
    label: <InstallHeader />,
    render: InstallCell,
  },
  {
    name: 'installed',
    sortable: true,
    render: InstalledCell,
  },
  {
    name: 'wanted',
    label: 'compatible',
    sortable: true,
    render: CompatibleCell,
  },
  {
    name: 'latest',
    sortable: true,
    render: LatestCell,
  },
  {
    name: 'actions',
    label: '',
    render: ActionsCell,
  },
];

export const Dependencies: VFC<Props> = ({ projectPath }) => {
  // this are fast
  const [dependenciesFast] = useFastDependencies(projectPath);
  // this are slow
  const [dependenciesFull] = useFullDependencies(projectPath);

  // bind async bundle score
  const dependenciesScored = useBundleScore(dependenciesFull || dependenciesFast);
  // bind async bundle details
  const dependencies = useBundleDetails(dependenciesScored);

  const {
    filters,
    setFilterValue,
    tableDataFiltered: dependenciesFiltered,
  } = useTableFilter(dependencies);

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
      console.log(dependenciesToUpdate);
    },
    [dependenciesFiltered],
  );

  return (
    <>
      <DependenciesHeader
        isGlobal={projectPath === 'global'}
        onForceReInstall={console.log}
        onInstallAll={console.log}
        onInstallNewDependency={console.log}
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

      <Table
        columns={columns}
        filters={filters}
        isEmpty={dependencies?.length === 0}
        onFilterChange={setFilterValue}
        tableData={dependenciesFiltered}
      />
    </>
  );
};
