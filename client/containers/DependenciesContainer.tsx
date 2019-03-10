import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { DependenciesStore } from '../stores/dependencies.store';
import { DependenciesTable } from '../components/dependencies/DependenciesTable';
import { DependenciesHeader } from '../components/dependencies/DependenciesHeader';
import { toJS } from 'mobx';
import { SearchContainer } from './SearchContainer';

interface Props {
  dependenciesStore?: DependenciesStore;
  projectPath?: string;
}

function sortFunction(a: any, b: any, sortKey: string): 0 | 1 | -1 {
  if (!a[sortKey] && !b[sortKey]) { return 0; }
  if (!a[sortKey] || a[sortKey] < b[sortKey]) { return -1; }
  if (!b[sortKey] || a[sortKey] > b[sortKey]) { return 1; }
  return 0;
}

@inject('dependenciesStore') @observer
export class DependenciesContainer extends React.Component<Props> {
  componentDidMount(): void {
    this.props.dependenciesStore.fetchDependencies(this.props.projectPath);
  }

  onSortChange = (sortKey: string): void => {
    this.props.dependenciesStore.setSortKey(sortKey);
  }

  onFilterChange = (filterKey: string, filterValue: string): void => {
    this.props.dependenciesStore.setFilter(filterKey, filterValue);
  }

  onInstallAll = () => {
    this.props.dependenciesStore.installAll(this.props.projectPath);
  }

  onUpdateAllToInstalled = () => {
    this.props.dependenciesStore.updateAllToVersion(this.props.projectPath, 'installed');
  }

  onUpdateAllToWanted = () => {
    this.props.dependenciesStore.updateAllToVersion(this.props.projectPath, 'wanted');
  }

  onUpdateAllToLatest = () => {
    this.props.dependenciesStore.updateAllToVersion(this.props.projectPath, 'latest');
  }

  onForceReInstall = () => {
    this.props.dependenciesStore.forceReinstallAll(this.props.projectPath);
  }

  onDeleteDependency = (dependency: Dependency.Entire): void => {
    this.props.dependenciesStore.deleteDependency(
      this.props.projectPath,
      dependency.repo,
      dependency.name,
      dependency.type,
    );
  }

  onInstallDependencyVersion = (dependency: Dependency.Entire, version: string): void => {
    this.props.dependenciesStore.installDependency(
      this.props.projectPath,
      dependency.repo,
      { version, name: dependency.name },
      dependency.type,
    );
  }

  onInstallNewDependency = (
    repo: Dependency.Repo, dependency: Dependency.Basic, type: Dependency.Type,
  ): void => {
    this.props.dependenciesStore.installDependency(
      this.props.projectPath,
      repo,
      dependency,
      type,
    );
  }

  getSortedDependencies(sortKey: string, sortReversed: boolean): Dependency.Entire[] {
    let dependencies = toJS(this.props.dependenciesStore.dependencies[this.props.projectPath]);
    if (sortKey && dependencies) {
      dependencies = dependencies.sort((a, b) => sortFunction(a, b, sortKey));
    }
    if (sortReversed && dependencies) {
      dependencies = dependencies.reverse();
    }
    return dependencies;
  }

  getFilteredDependencies(dependencies: Dependency.Entire[], filters: { [key: string]: string })
    : Dependency.Entire[] {
    if (!dependencies) {
      return dependencies;
    }
    return dependencies.filter((dependency) => {
      let isAvailable = true;
      Object.keys(filters)
        .forEach((name) => {
          if (!(dependency as any)[name].includes(filters[name])) {
            isAvailable = false;
          }
        });

      return isAvailable;
    });
  }

  render(): React.ReactNode {
    const sortKey = toJS(this.props.dependenciesStore.sortKey);
    const sortReversed = toJS(this.props.dependenciesStore.sortReversed);
    const filters = toJS(this.props.dependenciesStore.filters);

    const dependencies = this.getSortedDependencies(sortKey, sortReversed);
    const filteredDependencies = this.getFilteredDependencies(dependencies, filters);

    const dependenciesProcessing =
      toJS(this.props.dependenciesStore.dependenciesProcessing[this.props.projectPath]);

    return [
      (
        <DependenciesHeader
          key="1"
          onInstallAll={this.onInstallAll}
          onUpdateAllToInstalled={this.onUpdateAllToInstalled}
          onUpdateAllToWanted={this.onUpdateAllToWanted}
          onUpdateAllToLatest={this.onUpdateAllToLatest}
          onForceReInstall={this.onForceReInstall}
        >
          <SearchContainer
            type={this.props.projectPath ? 'project' : 'global'}
            onInstall={this.onInstallNewDependency}
          />
        </DependenciesHeader>
      ),
      (
        <DependenciesTable
          key="2"
          dependencies={filteredDependencies}
          dependenciesProcessing={dependenciesProcessing}
          sortKey={sortKey}
          sortReversed={sortReversed}
          onSortChange={this.onSortChange}
          onFilterChange={this.onFilterChange}
          filters={filters}
          onDeleteDependency={this.onDeleteDependency}
          onInstallDependencyVersion={this.onInstallDependencyVersion}
        />
      ),
    ];
  }
}
