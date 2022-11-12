/* eslint-disable no-console */
/* eslint-disable react/jsx-handler-names */
/* eslint-disable import/max-dependencies */
import type { ComponentProps, VFC } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { DependencyInstalledExtras } from '../../../../server/types/dependency.types';
import { useBundleDetails } from '../../../hooks/use-bundle-details';
import { useBundleScore } from '../../../hooks/use-bundle-score';
import { useFastDependencies } from '../../../hooks/use-fast-dependencies';
import { useFullDependencies } from '../../../hooks/use-full-dependencies';
import { Table } from '../../../ui/Table/Table';
import { useTableFilter } from '../../../ui/Table/use-table-filter';
import { DependenciesHeader } from './DependenciesHeader/DependenciesHeader';
import { InstallHeader } from './InstallHeader';
import { ActionsCell } from './table-cells/ActionsCell/ActionsCell';
import { CompatibleCell } from './table-cells/CompatibleCell';
import { HomePageCell } from './table-cells/HomePageCell';
import { InstallCell } from './table-cells/InstallCell/InstallCell';
import { InstalledCell } from './table-cells/InstalledCell';
import { LatestCell } from './table-cells/LatestCell';
import { NameCell } from './table-cells/NameCell';
import { NpmCell } from './table-cells/NpmCell';
import { OtherVersionCell } from './table-cells/OtherVersionCell/OtherVersionCell';
import { RepoCell } from './table-cells/RepoCell';
import { ScoreCell } from './table-cells/ScoreCell';
import { SizeCell } from './table-cells/SizeCell';
import { TimeCell } from './table-cells/TimeCell';
import { TypeCell } from './table-cells/TypeCell';
import { ToInstallHeader } from './ToInstallHeader';

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
  { name: 'required', sortable: true },
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
    label: <ToInstallHeader version='installed' />,
    render: InstalledCell,
  },
  {
    name: 'wanted',
    sortable: true,
    label: <ToInstallHeader version='wanted' />,
    render: CompatibleCell,
  },
  {
    name: 'latest',
    sortable: true,
    label: <ToInstallHeader version='latest' />,
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
  const { dependencies: dependenciesFast } = useFastDependencies(projectPath);
  // this are slow
  const { dependencies: dependenciesFull } = useFullDependencies(projectPath);

  // bind async bundle score
  const dependenciesScored = useBundleScore(dependenciesFull || dependenciesFast);
  // bind async bundle details
  const dependencies = useBundleDetails(dependenciesScored);

  const {
    filters,
    setFilterValue,
    tableDataFiltered: dependenciesFiltered,
  } = useTableFilter(dependencies);

  return (
    <>
      <DependenciesHeader
        isGlobal={projectPath === 'global'}
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
