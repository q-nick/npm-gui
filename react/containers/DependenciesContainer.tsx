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

  onInstallAll = () => {
    this.props.dependenciesStore.installAll(this.props.projectPath);
  }

  onUpdateAllToInstalled = () => {

  }

  onUpdateAllToWanted = () => {

  }

  onUpdateAllToLatest = () => {

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

  render(): React.ReactNode {
    const dependencies = toJS(this.props.dependenciesStore.dependencies[this.props.projectPath]);
    const dependenciesLoading = toJS(this.props.dependenciesStore.dependenciesLoading);
    const sortMatch = toJS(this.props.dependenciesStore.sortMatch);
    const sortKey = toJS(this.props.dependenciesStore.sortKey);
    const sortReversed = toJS(this.props.dependenciesStore.sortReversed);

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
          <SearchContainer type="project" />
        </DependenciesHeader>
      ),
      (
        <DependenciesTable
          key="2"
          dependencies={dependencies}
          dependenciesLoading={dependenciesLoading}
          sortMatch={sortMatch}
          sortKey={sortKey}
          sortReversed={sortReversed}
          onDeleteDependency={this.onDeleteDependency}
          onInstallDependencyVersion={this.onInstallDependencyVersion}
          type="project"
        />
      ),
    ];
  }
}
