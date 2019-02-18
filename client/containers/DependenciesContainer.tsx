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

@inject('dependenciesStore') @observer
export class DependenciesContainer extends React.Component<Props> {
  componentDidMount(): void {
    this.props.dependenciesStore.fetchDependencies(this.props.projectPath);
  }

  onSortChange = (sortKey: string): void => {
    this.props.dependenciesStore.setSortKey(sortKey);
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
      dependencies = dependencies.sort((a, b) => {
        const aa = a as any;
        const bb = b as any;
        // TODO fix
        if (!aa[sortKey] && !bb[sortKey]) { return 0; }
        if (!aa[sortKey] || aa[sortKey] < bb[sortKey]) { return -1; }
        if (!bb[sortKey] || aa[sortKey] > bb[sortKey]) { return 1; }
        return 0;
      });
    }
    if (sortReversed && dependencies) {
      dependencies = dependencies.reverse();
    }
    return dependencies;
  }

  render(): React.ReactNode {
    const sortKey = toJS(this.props.dependenciesStore.sortKey);
    const sortReversed = toJS(this.props.dependenciesStore.sortReversed);

    const dependencies = this.getSortedDependencies(sortKey, sortReversed);

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
          dependencies={dependencies}
          dependenciesProcessing={dependenciesProcessing}
          sortKey={sortKey}
          sortReversed={sortReversed}
          onSortChange={this.onSortChange}
          onDeleteDependency={this.onDeleteDependency}
          onInstallDependencyVersion={this.onInstallDependencyVersion}
        />
      ),
    ];
  }
}